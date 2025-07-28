-- レストランテーブルの作成（シンプル版）
CREATE TABLE restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 必須項目
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  area VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('spicy', 'oily', 'sweet')),
  
  -- カテゴリレベル（0-5の数値）
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 5),
  
  -- Google MapのURL
  google_map_url TEXT,
  
  -- UI上でドラッグ&ドロップで設定する位置（相対位置 0-100%）
  x_position DECIMAL(5, 2),
  y_position DECIMAL(5, 2),
  
  -- タイムスタンプ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX idx_restaurants_area ON restaurants(area);
CREATE INDEX idx_restaurants_category ON restaurants(category);

-- RLS (Row Level Security) の有効化
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- 読み取り専用ポリシー（誰でも読み取り可能）
CREATE POLICY "Anyone can read restaurants" ON restaurants FOR SELECT USING (true);

-- サンプルレストランデータの挿入
INSERT INTO restaurants (name, description, address, phone, area, category, level, google_map_url, x_position, y_position) VALUES
('太田さんラーメン', '昔ながらの醤油ラーメンが自慢の老舗店。スープは鶏ガラベースで優しい味わい。', '東京都渋谷区渋谷1-1-1', '03-1234-5678', '渋谷', 'spicy', 3, 'https://maps.google.com/?q=35.6595,139.7006', 45.0, 25.0),
('カフェ・ド・太田', 'こだわりのコーヒーと手作りスイーツが楽しめるおしゃれなカフェ。', '東京都渋谷区渋谷2-21-1', '03-2345-6789', '渋谷', 'sweet', 4, 'https://maps.google.com/?q=35.6584,139.7016', 55.0, 35.0),
('太田寿司', '新鮮なネタと職人の技が光る本格江戸前寿司店。カウンター席がおすすめ。', '東京都渋谷区渋谷3-5-6', '03-3456-7890', '渋谷', 'oily', 2, 'https://maps.google.com/?q=35.6612,139.7005', 40.0, 45.0),
('イタリアン太田', '本場イタリアの味を再現したパスタとピザが人気。ワインの種類も豊富。', '東京都渋谷区渋谷1-15-1', '03-4567-8901', '渋谷', 'oily', 3, 'https://maps.google.com/?q=35.6578,139.7028', 60.0, 50.0),
('太田焼肉', 'A5ランクの和牛を使用した高級焼肉店。特製タレが絶品。', '東京都渋谷区渋谷2-10-1', '03-5678-9012', '渋谷', 'oily', 5, 'https://maps.google.com/?q=35.6601,139.7018', 35.0, 60.0),
('スイーツ太田', '手作りケーキとパフェが自慢のスイーツ専門店。', '東京都渋谷区渋谷1-8-3', '03-6789-0123', '渋谷', 'sweet', 5, 'https://maps.google.com/?q=35.6588,139.7001', 65.0, 40.0),
('激辛太田', '激辛料理専門店。辛さレベルは10段階から選択可能。', '東京都渋谷区渋谷2-3-8', '03-7890-1234', '渋谷', 'spicy', 5, 'https://maps.google.com/?q=35.6607,139.7012', 50.0, 65.0),
('天ぷら太田', 'サクサクの天ぷらが味わえる老舗天ぷら店。', '東京都渋谷区渋谷3-2-5', '03-8901-2345', '渋谷', 'oily', 4, 'https://maps.google.com/?q=35.6593,139.7024', 30.0, 35.0),
('パンケーキ太田', 'ふわふわのパンケーキが人気のカフェ。', '東京都渋谷区渋谷1-12-7', '03-9012-3456', '渋谷', 'sweet', 3, 'https://maps.google.com/?q=35.6582,139.7008', 70.0, 55.0),
('韓国料理太田', '本格的な韓国料理が楽しめる。キムチは自家製。', '東京都渋谷区渋谷2-7-4', '03-0123-4567', '渋谷', 'spicy', 4, 'https://maps.google.com/?q=35.6599,139.7003', 45.0, 70.0),
('とんかつ太田', '厚切りとんかつが自慢の老舗とんかつ店。', '東京都渋谷区渋谷3-9-2', '03-1357-2468', '渋谷', 'oily', 3, 'https://maps.google.com/?q=35.6586,139.7020', 25.0, 50.0),
('アイス太田', '手作りアイスクリーム専門店。季節限定フレーバーも。', '東京都渋谷区渋谷1-6-9', '03-2468-1357', '渋谷', 'sweet', 2, 'https://maps.google.com/?q=35.6604,139.7026', 75.0, 30.0);
