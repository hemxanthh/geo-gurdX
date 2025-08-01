-- Disable email confirmation requirement for new user registrations
-- This allows users to login immediately after registration

-- Update the auth.users table to mark all users as confirmed
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, created_at)
WHERE email_confirmed_at IS NULL;

-- Create a function to automatically confirm new users
CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS trigger AS $$
BEGIN
  -- Automatically confirm the user's email
  UPDATE auth.users 
  SET email_confirmed_at = COALESCE(email_confirmed_at, created_at)
  WHERE id = NEW.id AND email_confirmed_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-confirm new users
DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_confirm
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION auto_confirm_user(); 