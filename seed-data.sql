-- Sample data for testing MyDataday app
-- This creates sample users, goals, and logs for development/testing

-- Note: In a real app, users are created through Supabase Auth
-- This is just for testing the database structure

-- Sample goals categories and data
INSERT INTO public.goals (id, user_id, title, description, category, target_frequency, frequency_type, difficulty_level, start_date, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Drink 8 glasses of water daily', 'Stay hydrated throughout the day for better health', 'health', 8, 'daily', 2, CURRENT_DATE - INTERVAL '7 days', 'active'),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Read for 30 minutes', 'Read books to expand knowledge and improve focus', 'personal', 1, 'daily', 3, CURRENT_DATE - INTERVAL '5 days', 'active'),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Exercise 3 times per week', 'Maintain physical fitness with regular workouts', 'health', 3, 'weekly', 4, CURRENT_DATE - INTERVAL '10 days', 'active'),
  ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Learn Spanish vocabulary', 'Study 20 new Spanish words daily', 'education', 1, 'daily', 3, CURRENT_DATE - INTERVAL '3 days', 'active'),
  ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Save $50 per week', 'Build emergency fund by saving consistently', 'financial', 1, 'weekly', 2, CURRENT_DATE - INTERVAL '14 days', 'active');

-- Sample daily logs (showing progress over the past week)
INSERT INTO public.daily_logs (id, user_id, goal_id, log_date, completed, completion_time, progress_value, progress_unit, notes, mood_rating, energy_level) VALUES
  -- Water drinking logs
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '6 days', true, NOW() - INTERVAL '6 days 2 hours', 8, 'glasses', 'Felt great staying hydrated!', 4, 4),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '5 days', true, NOW() - INTERVAL '5 days 3 hours', 7, 'glasses', 'Almost hit target', 3, 3),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '4 days', false, null, 4, 'glasses', 'Busy day, forgot to drink enough', 2, 2),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '3 days', true, NOW() - INTERVAL '3 days 1 hour', 9, 'glasses', 'Exceeded goal!', 5, 4),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '2 days', true, NOW() - INTERVAL '2 days 4 hours', 8, 'glasses', 'Right on target', 4, 4),
  ('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '1 day', true, NOW() - INTERVAL '1 day 2 hours', 8, 'glasses', 'Consistent progress', 4, 3),
  
  -- Reading logs
  ('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', CURRENT_DATE - INTERVAL '4 days', true, NOW() - INTERVAL '4 days 8 hours', 35, 'minutes', 'Read "Atomic Habits" - great insights', 5, 4),
  ('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', CURRENT_DATE - INTERVAL '3 days', true, NOW() - INTERVAL '3 days 7 hours', 30, 'minutes', 'Finished chapter 3', 4, 4),
  ('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', CURRENT_DATE - INTERVAL '2 days', false, null, 0, 'minutes', 'Too tired after work', 2, 1),
  ('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', CURRENT_DATE - INTERVAL '1 day', true, NOW() - INTERVAL '1 day 9 hours', 45, 'minutes', 'Made up for yesterday, great session', 5, 5),
  
  -- Exercise logs (weekly goal)
  ('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '6 days', true, NOW() - INTERVAL '6 days 6 hours', 60, 'minutes', 'Full body workout at gym', 4, 3),
  ('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '4 days', true, NOW() - INTERVAL '4 days 7 hours', 45, 'minutes', 'Cardio and stretching', 4, 4),
  ('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '2 days', true, NOW() - INTERVAL '2 days 6 hours', 75, 'minutes', 'Strength training session', 5, 4),
  
  -- Spanish learning logs
  ('660e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440004', CURRENT_DATE - INTERVAL '2 days', true, NOW() - INTERVAL '2 days 10 hours', 20, 'words', 'Learned food vocabulary', 4, 4),
  ('660e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440004', CURRENT_DATE - INTERVAL '1 day', true, NOW() - INTERVAL '1 day 11 hours', 25, 'words', 'Family members vocabulary', 4, 3);

-- Sample Emergency Support Team
INSERT INTO public.emergency_support_team (id, user_id, name, relationship, email, phone, notify_on_day, notification_method, is_active) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Sarah Johnson', 'friend', 'sarah.j@email.com', '+1-555-0123', 2, 'email', true),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Mike Chen', 'colleague', 'mike.chen@email.com', '+1-555-0124', 3, 'both', true),
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Mom', 'family', 'mom@email.com', '+1-555-0125', 1, 'sms', true);

-- Sample AI Interactions
INSERT INTO public.ai_interactions (id, user_id, goal_id, interaction_type, ai_persona, user_message, ai_response, context_data) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'coaching', 'coach', 'I''m struggling to remember to drink water throughout the day', 'Great question! Here are some proven strategies: 1) Set hourly reminders on your phone, 2) Keep a water bottle visible on your desk, 3) Drink a glass right when you wake up. Which of these resonates most with you?', '{"recent_completion_rate": 0.7, "current_streak": 3}'),
  ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'motivation', 'friend', 'I missed reading yesterday and feel bad about it', 'Hey, don''t be so hard on yourself! Missing one day doesn''t erase all your progress. You''ve been doing great with your reading habit - I can see you''ve hit your goal 3 out of the last 4 days. That''s awesome! What matters is getting back on track today. What book are you reading?', '{"missed_days_this_week": 1, "total_reading_time": 110}');

-- Sample Streaks
INSERT INTO public.streaks (id, user_id, goal_id, current_streak, longest_streak, last_completed_date) VALUES
  ('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 3, 5, CURRENT_DATE - INTERVAL '1 day'),
  ('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 1, 3, CURRENT_DATE - INTERVAL '1 day'),
  ('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 3, 3, CURRENT_DATE - INTERVAL '2 days'),
  ('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440004', 2, 2, CURRENT_DATE - INTERVAL '1 day');
