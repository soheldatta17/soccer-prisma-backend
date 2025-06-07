/**
 * Response Utility
 * Part of Soccer Team Management API
 * 
 * Provides standardized response formatting utilities.
 * 
 * @author Sohel Datta <soheldatta17@gmail.com>
 * @copyright Copyright (c) 2024 Sohel Datta
 * @license MIT
 * @repository https://github.com/soheldatta17/soccer-prisma-backend
 */

export function sendJSON(status: number, success: boolean, content: any) {
  return new Response(
    JSON.stringify({
      status: success,
      content,
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
