export type DiffRow = {
  leftLine: string | null;
  rightLine: string | null;
  leftType: 'same' | 'removed' | 'empty';
  rightType: 'same' | 'added' | 'empty';
};

/** Line-aligned side-by-side diff rows for before/after markdown text. */
export function buildSideBySideDiff(before: string, after: string): DiffRow[] {
  const leftLines = before.split('\n');
  const rightLines = after.split('\n');
  const m = leftLines.length;
  const n = rightLines.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (leftLines[i - 1] === rightLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const reversed: DiffRow[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
      reversed.push({
        leftLine: leftLines[i - 1],
        rightLine: rightLines[j - 1],
        leftType: 'same',
        rightType: 'same',
      });
      i -= 1;
      j -= 1;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      reversed.push({
        leftLine: null,
        rightLine: rightLines[j - 1],
        leftType: 'empty',
        rightType: 'added',
      });
      j -= 1;
    } else {
      reversed.push({
        leftLine: leftLines[i - 1],
        rightLine: null,
        leftType: 'removed',
        rightType: 'empty',
      });
      i -= 1;
    }
  }

  return reversed.reverse();
}
