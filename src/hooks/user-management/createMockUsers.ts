
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates mock users for demonstration purposes when no users exist
 */
export const createMockUsers = async (tenantId: string | null, user: any): Promise<void> => {
  try {
    if (!tenantId || !user) return;
    
    // Create the current user first if it doesn't exist
    const { data: existingUser } = await supabase
      .from('breeder_profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    
    if (!existingUser) {
      await supabase
        .from('breeder_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          tenant_id: tenantId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }
    
    // Add some sample staff members
    const sampleUsers = [
      {
        id: '2f9d3a1e-5b3c-42d1-9d8f-62a1e294b465',
        email: 'staff@example.com',
        first_name: 'Staff',
        last_name: 'Member',
        role: 'staff',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tenant_id: tenantId
      },
      {
        id: '3e8c7b2a-4d9f-48e7-b1a6-5c3d2f981e0d',
        email: 'manager@example.com',
        first_name: 'Manager',
        last_name: 'User',
        role: 'manager',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tenant_id: tenantId
      }
    ];
    
    // Check if these sample users exist before inserting
    for (const sampleUser of sampleUsers) {
      const { data: existingSample } = await supabase
        .from('breeder_profiles')
        .select('id')
        .eq('id', sampleUser.id)
        .single();
      
      if (!existingSample) {
        await supabase
          .from('breeder_profiles')
          .upsert(sampleUser);
      }
    }
    
    console.log('Mock users created successfully');
  } catch (error: any) {
    console.error('Error creating mock users:', error);
  }
};
