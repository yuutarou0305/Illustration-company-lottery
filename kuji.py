import random
import os
from datetime import datetime

RECORD_FILE = 'kuji_record.txt'

def get_time_slot():
    now = datetime.now()
    date_str = now.strftime('%Y-%m-%d')
    if now.hour < 12:
        slot = 'AM'
    else:
        slot = 'PM'
    return f'{date_str}_{slot}'

def has_drawn_today():
    slot = get_time_slot()
    if os.path.exists(RECORD_FILE):
        with open(RECORD_FILE, 'r') as f:
            last_slot = f.read().strip()
            if last_slot == slot:
                return True
    return False

def record_draw():
    slot = get_time_slot()
    with open(RECORD_FILE, 'w') as f:
        f.write(slot)

def main():
    print("=== くじ引きプログラム（12時でリセット） ===")
    if has_drawn_today():
        print("今日はもうくじを引いています。12時を過ぎたらまた引けます。")
        return

    total = int(input("くじの本数を入力してください: "))
    win = int(input("当たりの本数を入力してください: "))
    
    if win > total or win < 0 or total <= 0:
        print("入力値が不正です。")
        return

    kujis = ['当たり'] * win + ['ハズレ'] * (total - win)
    random.shuffle(kujis)

    input("Enterキーでくじを引く...")
    result = kujis.pop()
    print(f"結果: {result}")
    record_draw()
    print("くじの記録を保存しました。12時を過ぎたらまた引けます。")

if __name__ == "__main__":
    main() 