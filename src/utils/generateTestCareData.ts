
import { supabase } from '@/integrations/supabase/client';

export const generateTestCareData = async (userId: string): Promise<{success: boolean, message: string}> => {
  try {
    // First check if we have any dogs
    const { data: dogs, error: dogsError } = await supabase
      .from('dogs')
      .select('id, name');
      
    if (dogsError) throw dogsError;
    
    if (!dogs || dogs.length === 0) {
      return {
        success: false,
        message: 'No dogs found. Please add dogs before generating care data.'
      };
    }
    
    // Generate some care tasks if needed
    const { data: existingTasks, error: tasksError } = await supabase
      .from('care_task_presets')
      .select('id')
      .limit(1);
      
    if (tasksError) throw tasksError;
    
    if (!existingTasks || existingTasks.length === 0) {
      // Create default task presets
      const defaultTasks = [
        { category: 'Potty Breaks', task_name: 'Potty Break', is_default: true },
        { category: 'Feeding', task_name: 'Morning Feeding', is_default: true },
        { category: 'Feeding', task_name: 'Evening Feeding', is_default: true },
        { category: 'Grooming', task_name: 'Brush', is_default: true },
        { category: 'Grooming', task_name: 'Bath', is_default: true },
        { category: 'Medications', task_name: 'Heartworm', is_default: true },
        { category: 'Exercise', task_name: 'Walk', is_default: true },
        { category: 'Exercise', task_name: 'Play', is_default: true }
      ];
      
      const { error: insertTasksError } = await supabase
        .from('care_task_presets')
        .insert(defaultTasks);
        
      if (insertTasksError) throw insertTasksError;
      console.log('Created default care task presets');
    }
    
    // Generate care logs for today
    const today = new Date();
    const careLogs = [];
    
    // Generate logs for each dog
    for (const dog of dogs) {
      // Morning potty break (8 AM)
      const morningTime = new Date(today);
      morningTime.setHours(8, 0, 0, 0);
      careLogs.push({
        dog_id: dog.id,
        created_by: userId,
        category: 'Potty Breaks',
        task_name: 'Potty Break',
        timestamp: morningTime.toISOString(),
        notes: 'Morning potty break'
      });
      
      // Morning feeding (8:30 AM)
      const morningFeedingTime = new Date(today);
      morningFeedingTime.setHours(8, 30, 0, 0);
      careLogs.push({
        dog_id: dog.id,
        created_by: userId,
        category: 'Feeding',
        task_name: 'Morning Feeding',
        timestamp: morningFeedingTime.toISOString(),
        notes: 'Morning feeding'
      });
      
      // Noon potty break (12 PM)
      const noonTime = new Date(today);
      noonTime.setHours(12, 0, 0, 0);
      careLogs.push({
        dog_id: dog.id,
        created_by: userId,
        category: 'Potty Breaks',
        task_name: 'Potty Break',
        timestamp: noonTime.toISOString(),
        notes: 'Noon potty break'
      });
      
      // Evening potty break (5 PM)
      const eveningTime = new Date(today);
      eveningTime.setHours(17, 0, 0, 0);
      careLogs.push({
        dog_id: dog.id,
        created_by: userId,
        category: 'Potty Breaks',
        task_name: 'Potty Break',
        timestamp: eveningTime.toISOString(),
        notes: 'Evening potty break'
      });
      
      // Evening feeding (5:30 PM)
      const eveningFeedingTime = new Date(today);
      eveningFeedingTime.setHours(17, 30, 0, 0);
      careLogs.push({
        dog_id: dog.id,
        created_by: userId,
        category: 'Feeding',
        task_name: 'Evening Feeding',
        timestamp: eveningFeedingTime.toISOString(),
        notes: 'Evening feeding'
      });
    }
    
    // Insert the care logs
    const { error: insertLogsError } = await supabase
      .from('daily_care_logs')
      .insert(careLogs);
      
    if (insertLogsError) throw insertLogsError;
    
    return {
      success: true,
      message: `Generated ${careLogs.length} care logs for ${dogs.length} dogs.`
    };
  } catch (error) {
    console.error('Error generating test care data:', error);
    return {
      success: false,
      message: `Error generating test data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
