-- Allow vendors to update venue inquiries for their own venues

-- Drop existing update policy if any
DROP POLICY IF EXISTS "vendors_update_inquiries" ON venue_inquiries;

-- Create policy allowing vendors to update inquiries for their venues
CREATE POLICY "vendors_update_inquiries"
  ON venue_inquiries
  FOR UPDATE
  TO authenticated
  USING (
    venue_id IN (
      SELECT id FROM venues WHERE owner_id = auth.uid()
    )
  );

SELECT '✅ Vendors can now update inquiries for their venues!' as result;
