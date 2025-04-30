
/**
 * Helper functions for Supabase queries
 */

/**
 * Fetch custom terms with dialect information
 * @param supabaseClient The Supabase client instance
 * @param standardTerm The standard term to fetch
 * @returns Promise with the query results
 */
export const fetchCustomTermsWithDialects = async (supabaseClient: any, standardTerm: string) => {
  // Using a raw query to work around TypeScript join limitations
  const { data, error } = await supabaseClient
    .from('custom_terms')
    .select(`
      id,
      custom_term,
      standard_term,
      dialects:dialect_id (
        name
      )
    `)
    .eq('standard_term', standardTerm);

  // Format the results to have dialect_name for easier use in the component
  const formattedData = data?.map(item => ({
    ...item,
    dialect_name: item.dialects?.name
  }));

  return { data: formattedData, error };
};
