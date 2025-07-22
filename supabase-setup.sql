-- 飲食店テーブルの作成
CREATE TABLE restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- リアクションテーブルの作成
CREATE TABLE reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  reaction_type VARCHAR(10) CHECK (reaction_type IN ('like', 'bad')) NOT NULL,
  count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, reaction_type)
);

-- インデックスの作成
CREATE INDEX idx_restaurants_location ON restaurants(latitude, longitude);
CREATE INDEX idx_reactions_restaurant_id ON reactions(restaurant_id);

-- RLS (Row Level Security) の有効化
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- 読み取り専用ポリシー（誰でも読み取り可能）
CREATE POLICY "Anyone can read restaurants" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Anyone can read reactions" ON reactions FOR SELECT USING (true);

-- リアクションの更新ポリシー（誰でも更新可能）
CREATE POLICY "Anyone can update reactions" ON reactions FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert reactions" ON reactions FOR INSERT WITH CHECK (true);

-- サンプルデータの挿入
INSERT INTO restaurants (id, name, description, latitude, longitude, address, category) VALUES
('550e8400-e29b-41d4-a716-446655440001', '太田さんラーメン', '昔ながらの醤油ラーメンが自慢の老舗店。スープは鶏ガラベースで優しい味わい。', 35.6895, 139.6917, '東京都千代田区丸の内1-1-1', 'ラーメン'),
('550e8400-e29b-41d4-a716-446655440002', 'カフェ・ド・太田', 'こだわりのコーヒーと手作りスイーツが楽しめるおしゃれなカフェ。', 35.6762, 139.6503, '東京都渋谷区渋谷2-21-1', 'カフェ'),
('550e8400-e29b-41d4-a716-446655440003', '太田寿司', '新鮮なネタと職人の技が光る本格江戸前寿司店。カウンター席がおすすめ。', 35.6586, 139.7454, '東京都中央区銀座4-5-6', '寿司'),
('550e8400-e29b-41d4-a716-446655440004', 'イタリアン太田', '本場イタリアの味を再現したパスタとピザが人気。ワインの種類も豊富。', 35.6654, 139.7707, '東京都台東区上野3-15-1', 'イタリアン'),
('550e8400-e29b-41d4-a716-446655440005', '太田焼肉', 'A5ランクの和牛を使用した高級焼肉店。特製タレが絶品。', 35.6580, 139.7016, '東京都港区六本木6-10-1', '焼肉');

-- サンプルリアクションデータの挿入
INSERT INTO reactions (restaurant_id, reaction_type, count) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'like', 42),
('550e8400-e29b-41d4-a716-446655440001', 'bad', 3),
('550e8400-e29b-41d4-a716-446655440002', 'like', 28),
('550e8400-e29b-41d4-a716-446655440002', 'bad', 1),
('550e8400-e29b-41d4-a716-446655440003', 'like', 67),
('550e8400-e29b-41d4-a716-446655440003', 'bad', 2),
('550e8400-e29b-41d4-a716-446655440004', 'like', 35),
('550e8400-e29b-41d4-a716-446655440004', 'bad', 5),
('550e8400-e29b-41d4-a716-446655440005', 'like', 89),
('550e8400-e29b-41d4-a716-446655440005', 'bad', 7);

-- リアクション更新用の関数
CREATE OR REPLACE FUNCTION increment_reaction(
  p_restaurant_id UUID,
  p_reaction_type VARCHAR(10)
)
RETURNS void AS $$
BEGIN
  INSERT INTO reactions (restaurant_id, reaction_type, count)
  VALUES (p_restaurant_id, p_reaction_type, 1)
  ON CONFLICT (restaurant_id, reaction_type)
  DO UPDATE SET 
    count = reactions.count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
