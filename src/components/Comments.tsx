"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured, type Comment } from "@/lib/supabase";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return `${local[0]}${"*".repeat(Math.max(local.length - 1, 2))}@${domain}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

function CommentItem({
  comment,
  replies,
  userId,
  onReply,
  onDelete,
}: {
  comment: Comment & { email?: string };
  replies: (Comment & { email?: string })[];
  userId: string | null;
  onReply: (parentId: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
          <span>{comment.email ? maskEmail(comment.email) : "사용자"}</span>
          <span>{timeAgo(comment.created_at)}</span>
        </div>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
          {comment.content}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onReply(comment.id)}
            className="text-xs text-zinc-400 hover:text-[#2563EB] transition-colors"
          >
            답글
          </button>
          {userId === comment.user_id && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
            >
              삭제
            </button>
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <div className="ml-8 space-y-3 border-l-2 border-zinc-100 dark:border-zinc-800 pl-4">
          {replies.map((reply) => (
            <div key={reply.id} className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                <span>{reply.email ? maskEmail(reply.email) : "사용자"}</span>
                <span>{timeAgo(reply.created_at)}</span>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {reply.content}
              </p>
              {userId === reply.user_id && (
                <button
                  onClick={() => onDelete(reply.id)}
                  className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Comments({ ideaId }: { ideaId: string }) {
  const [comments, setComments] = useState<(Comment & { email?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from("comments")
      .select("*, profiles(email)")
      .eq("idea_id", ideaId)
      .order("created_at", { ascending: true });

    if (data) {
      setComments(
        data.map((c: Record<string, unknown>) => ({
          ...(c as unknown as Comment),
          email: (c.profiles as { email?: string } | null)?.email,
        }))
      );
    }
  }, [ideaId]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });

    fetchComments().then(() => setLoading(false));
  }, [fetchComments]);

  const handleSubmit = async () => {
    if (!userId || !content.trim()) return;
    setSubmitting(true);

    await supabase.from("comments").insert({
      user_id: userId,
      idea_id: ideaId,
      parent_id: replyTo,
      content: content.trim(),
    });

    setContent("");
    setReplyTo(null);
    await fetchComments();
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("comments").delete().eq("id", id);
    await fetchComments();
  };

  const topLevel = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-5">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
        댓글 {!loading && comments.length > 0 && (
          <span className="text-sm font-normal text-zinc-400">({comments.length})</span>
        )}
      </h2>

      {/* Comment input */}
      {userId ? (
        <div className="space-y-2">
          {replyTo && (
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>답글 작성 중</span>
              <button
                onClick={() => setReplyTo(null)}
                className="text-red-400 hover:text-red-500"
              >
                취소
              </button>
            </div>
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="의견을 남겨주세요..."
            maxLength={2000}
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting || !content.trim()}
              className="px-4 py-1.5 text-sm font-medium rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "작성 중..." : "작성"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          <a href="/auth/" className="text-[#2563EB] hover:underline">로그인</a> 후 댓글을 작성할 수 있습니다
        </p>
      )}

      {/* Comments list */}
      {loading ? (
        <p className="text-sm text-zinc-400">불러오는 중...</p>
      ) : topLevel.length === 0 ? (
        <p className="text-sm text-zinc-400">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
      ) : (
        <div className="space-y-5 divide-y divide-zinc-100 dark:divide-zinc-800">
          {topLevel.map((comment) => (
            <div key={comment.id} className="pt-5 first:pt-0">
              <CommentItem
                comment={comment}
                replies={getReplies(comment.id)}
                userId={userId}
                onReply={(parentId) => setReplyTo(parentId)}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
