-- エリアテーブルの作成
CREATE TABLE areas (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_path VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 飲食店テーブルの作成（エリア情報を追加）
CREATE TABLE restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  area_id VARCHAR(50) REFERENCES areas(id) ON DELETE CASCADE,
  google_place_id VARCHAR(255),
  yahoo_store_id VARCHAR(255),
  phone VARCHAR(50),
  website_url TEXT,
  opening_hours TEXT,
  price_range VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 地図ピンテーブルの作成（イラスト地図用）
CREATE TABLE map_pins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  area_id VARCHAR(50) REFERENCES areas(id) ON DELETE CASCADE,
  x_position DECIMAL(5, 2) NOT NULL CHECK (x_position >= 0 AND x_position <= 100),
  y_position DECIMAL(5, 2) NOT NULL CHECK (y_position >= 0 AND y_position <= 100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, area_id)
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
CREATE INDEX idx_restaurants_area_id ON restaurants(area_id);
CREATE INDEX idx_reactions_restaurant_id ON reactions(restaurant_id);
CREATE INDEX idx_map_pins_area_id ON map_pins(area_id);
CREATE INDEX idx_map_pins_restaurant_id ON map_pins(restaurant_id);

-- RLS (Row Level Security) の有効化
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE map_pins ENABLE ROW LEVEL SECURITY;

-- 読み取り専用ポリシー（誰でも読み取り可能）
CREATE POLICY "Anyone can read areas" ON areas FOR SELECT USING (true);
CREATE POLICY "Anyone can read restaurants" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Anyone can read reactions" ON reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can read map_pins" ON map_pins FOR SELECT USING (true);

-- リアクションの更新ポリシー（誰でも更新可能）
CREATE POLICY "Anyone can update reactions" ON reactions FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert reactions" ON reactions FOR INSERT WITH CHECK (true);

-- エリアデータの挿入（渋谷のみ）
INSERT INTO areas (id, name, description, image_path, is_active) VALUES
('shibuya', '渋谷', '若者の街として知られる渋谷エリア。多様な飲食店が集まる。', '/image/maps/shibuya.webp', true);

-- サンプル飲食店データの挿入
INSERT INTO restaurants (id, name, description, latitude, longitude, address, category, area_id, google_place_id, phone, opening_hours, price_range) VALUES
('550e8400-e29b-41d4-a716-446655440001', '太田さんラーメン', '昔ながらの醤油ラーメンが自慢の老舗店。スープは鶏ガラベースで優しい味わい。', 35.6595, 139.7006, '東京都渋谷区渋谷1-1-1', 'spicy', 'shibuya', null, '03-1234-5678', '11:00-22:00', '¥500-¥1000'),
('550e8400-e29b-41d4-a716-446655440002', 'カフェ・ド・太田', 'こだわりのコーヒーと手作りスイーツが楽しめるおしゃれなカフェ。', 35.6584, 139.7016, '東京都渋谷区渋谷2-21-1', 'sweet', 'shibuya', null, '03-2345-6789', '8:00-20:00', '¥800-¥1500'),
('550e8400-e29b-41d4-a716-446655440003', '太田寿司', '新鮮なネタと職人の技が光る本格江戸前寿司店。カウンター席がおすすめ。', 35.6612, 139.7005, '東京都渋谷区渋谷3-5-6', 'oily', 'shibuya', null, '03-3456-7890', '17:00-23:00', '¥3000-¥8000'),
('550e8400-e29b-41d4-a716-446655440004', 'イタリアン太田', '本場イタリアの味を再現したパスタとピザが人気。ワインの種類も豊富。', 35.6578, 139.7028, '東京都渋谷区渋谷1-15-1', 'oily', 'shibuya', null, '03-4567-8901', '11:30-14:30, 17:30-22:00', '¥2000-¥4000'),
('550e8400-e29b-41d4-a716-446655440005', '太田焼肉', 'A5ランクの和牛を使用した高級焼肉店。特製タレが絶品。', 35.6601, 139.7018, '東京都渋谷区渋谷2-10-1', 'oily', 'shibuya', null, '03-5678-9012', '17:00-24:00', '¥4000-¥10000'),
('550e8400-e29b-41d4-a716-446655440006', 'スイーツ太田', '手作りケーキとパフェが自慢のスイーツ専門店。', 35.6588, 139.7001, '東京都渋谷区渋谷1-8-3', 'sweet', 'shibuya', null, '03-6789-0123', '10:00-21:00', '¥600-¥1200'),
('550e8400-e29b-41d4-a716-446655440007', '激辛太田', '激辛料理専門店。辛さレベルは10段階から選択可能。', 35.6607, 139.7012, '東京都渋谷区渋谷2-3-8', 'spicy', 'shibuya', null, '03-7890-1234', '11:00-23:00', '¥1000-¥2000'),
('550e8400-e29b-41d4-a716-446655440008', '天ぷら太田', 'サクサクの天ぷらが味わえる老舗天ぷら店。', 35.6593, 139.7024, '東京都渋谷区渋谷3-2-5', 'oily', 'shibuya', null, '03-8901-2345', '11:30-14:00, 17:00-21:00', '¥1500-¥3000'),
('550e8400-e29b-41d4-a716-446655440009', 'パンケーキ太田', 'ふわふわのパンケーキが人気のカフェ。', 35.6582, 139.7008, '東京都渋谷区渋谷1-12-7', 'sweet', 'shibuya', null, '03-9012-3456', '9:00-18:00', '¥800-¥1500'),
('550e8400-e29b-41d4-a716-446655440010', '韓国料理太田', '本格的な韓国料理が楽しめる。キムチは自家製。', 35.6599, 139.7003, '東京都渋谷区渋谷2-7-4', 'spicy', 'shibuya', null, '03-0123-4567', '11:00-22:30', '¥1200-¥2500'),
('550e8400-e29b-41d4-a716-446655440011', 'とんかつ太田', '厚切りとんかつが自慢の老舗とんかつ店。', 35.6586, 139.7020, '東京都渋谷区渋谷3-9-2', 'oily', 'shibuya', null, '03-1357-2468', '11:00-21:00', '¥1000-¥2000'),
('550e8400-e29b-41d4-a716-446655440012', 'アイス太田', '手作りアイスクリーム専門店。季節限定フレーバーも。', 35.6604, 139.7026, '東京都渋谷区渋谷1-6-9', 'sweet', 'shibuya', null, '03-2468-1357', '10:00-22:00', '¥400-¥800');

-- 地図ピンデータの挿入（渋谷エリア）
INSERT INTO map_pins (restaurant_id, area_id, x_position, y_position) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'shibuya', 45.0, 25.0),
('550e8400-e29b-41d4-a716-446655440002', 'shibuya', 55.0, 35.0),
('550e8400-e29b-41d4-a716-446655440003', 'shibuya', 40.0, 45.0),
('550e8400-e29b-41d4-a716-446655440004', 'shibuya', 60.0, 50.0),
('550e8400-e29b-41d4-a716-446655440005', 'shibuya', 35.0, 60.0),
('550e8400-e29b-41d4-a716-446655440006', 'shibuya', 65.0, 40.0),
('550e8400-e29b-41d4-a716-446655440007', 'shibuya', 50.0, 65.0),
('550e8400-e29b-41d4-a716-446655440008', 'shibuya', 30.0, 35.0),
('550e8400-e29b-41d4-a716-446655440009', 'shibuya', 70.0, 55.0),
('550e8400-e29b-41d4-a716-446655440010', 'shibuya', 45.0, 70.0),
('550e8400-e29b-41d4-a716-446655440011', 'shibuya', 25.0, 50.0),
('550e8400-e29b-41d4-a716-446655440012', 'shibuya', 75.0, 30.0);

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
