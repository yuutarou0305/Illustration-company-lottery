const fs = require('fs');
const readline = require('readline');
const path = require('path');

const RECORD_FILE = path.join(__dirname, 'kuji_record.txt');

function getTimeSlot() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const slot = now.getHours() < 12 ? 'AM' : 'PM';
  return `${dateStr}_${slot}`;
}

function hasDrawnToday() {
  const slot = getTimeSlot();
  if (fs.existsSync(RECORD_FILE)) {
    const lastSlot = fs.readFileSync(RECORD_FILE, 'utf8').trim();
    if (lastSlot === slot) {
      return true;
    }
  }
  return false;
}

function recordDraw() {
  const slot = getTimeSlot();
  fs.writeFileSync(RECORD_FILE, slot);
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function main() {
  console.log('=== くじ引きプログラム（12時でリセット） ===');
  if (hasDrawnToday()) {
    console.log('今日はもうくじを引いています。12時を過ぎたらまた引けます。');
    return;
  }

  const total = parseInt(await askQuestion('くじの本数を入力してください: '), 10);
  const win = parseInt(await askQuestion('当たりの本数を入力してください: '), 10);

  if (isNaN(total) || isNaN(win) || win > total || win < 0 || total <= 0) {
    console.log('入力値が不正です。');
    return;
  }

  const kujis = Array(win).fill('当たり').concat(Array(total - win).fill('ハズレ'));
  // シャッフル
  for (let i = kujis.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kujis[i], kujis[j]] = [kujis[j], kujis[i]];
  }

  await askQuestion('Enterキーでくじを引く...');
  const result = kujis.pop();
  console.log(`結果: ${result}`);
  recordDraw();
  console.log('くじの記録を保存しました。12時を過ぎたらまた引けます。');
}

main(); 