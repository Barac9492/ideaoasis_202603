#!/bin/bash
MAX_ITERATIONS=${1:-5}
ITERATION=0

while [ $ITERATION -lt $MAX_ITERATIONS ]; do
  ITERATION=$((ITERATION + 1))
  echo "=== Ralph 반복 $ITERATION / $MAX_ITERATIONS ==="
  
  claude -p --dangerously-skip-permissions "prd.md 파일을 읽고, 체크리스트에서 아직 완료되지 않은 항목 하나를 골라서 구현해라. 완료된 항목은 [x]로 표시하고 git commit 해라. 모든 체크리스트가 완료되면 COMPLETE 라고만 출력해라." | tee /tmp/ralph-output.txt
  
  if grep -q "COMPLETE" /tmp/ralph-output.txt; then
    echo "=== 모든 작업 완료! ==="
    break
  fi
done
