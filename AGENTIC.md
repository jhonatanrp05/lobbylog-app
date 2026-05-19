1. Tool Used

I used Claude during all the project development. I used Claude in the backend to debug the code, detect issues, bad practices, and to identify security breaches. In the frontend, I used Claude to make a guided generation of the components, because the HeroUI library had many different changes in their properties and detecting errors could be frustrating and take more time than needed. I used the official documentation as context for Claude. The V3 is new and included breaking changes from previous versions and generating code without it would have been impossible.

2. My Approach

First, I constructed the idea of WHAT I wanted to build, defining the requirements, every use flow a user could make, what actions each role can execute, and how it will work, building a dedicated project for both backend and frontend.

During the backend development, I had a clear structure of the project (controllers, services, repositories, routes, JWT, middleware, etc.) and created most of the code. Claude worked here as a debugger, detecting bad practices, security improvements, and fixing some type errors.

During the frontend development Claude generated most of the code; I dictated what functionalities should be in every view and kept the code with a good organization.

3. Key Prompts

The first and most important prompt was the database schema. Since I already had the requirements and all the key concepts, translating that documentation into a schema for Prisma was my starting point of coding and I preferred this task to be done by Claude. I already knew concepts like 1:1, 1:N, foreign key, etc., so I was able to fix out-of-context errors. With a good schema, all the next development should go in a proper and efficient way.

Once a solid backend was working, but needed fixes that were made during the frontend development, Claude was mainly coding the views, but made a wrong choice for how to display packages and users — it was using tables for everything. I asked Claude to change the packages view for receptionists and residents to a Cards view, since they are easier to read and greatly improve the presentation and user experience. The tables were left for the admin view. I noticed that Claude used almost the exact same component for both receptionist and resident views, so a new reusable component for Package Cards was created in order to keep the code clean and efficient.

During the final usability tests I detected that Claude left conflicting logic in the users view for the admin: you could create other users with the admin role and as an admin you could delete every account, including your own. I deleted the Admin option in the select component. For the self-deletion restriction, I asked Claude to disable the delete button when the logged-in user matches the row being deleted.

4. Critical Evaluation

Even though users were deleted from the admin view and no error appeared, when refreshing the page the deleted user appeared again. Looking at the Network logs from the browser I saw that the response of the request returned a 500 server error. I immediately realized that, since it was not an error handled on the backend and it occurred during a delete, the only possible reason was that the delete could not happen because the user was being referenced by other entities. I had 2 options: force a cascade delete, which would delete all the package records where the user was referenced, or add a soft delete. I chose the second option and added a new nullable DateTime field (deletedAt) to the User entity, filtering out non-null values in every GET query. After that change the code was working well.

During the frontend development, Claude hardcoded the Cloudinary cloud name and upload preset directly in the code. I noticed this while reviewing the generated code and asked Claude to move those values to .env.

5. What You Learned

- Foreign key constraints and soft delete. Deleting a user that had packages linked to them failed at the database level. I learned that a foreign key prevents removing a row that other rows still reference, and chose soft delete over cascade to preserve the package history.

- How a JWT actually works. I have used JWT before in my university projects, but I couldn't actually explain and understand fully how it works until now. Anyone can decode and read its payload, so sensitive data must never go inside it. The signature only proves the token was not tampered with. I also learned the difference between an httpOnly cookie and a Bearer header for sending the token.

- Something that at the end Claude suggested to change was the error messages from trying to login, Returning different messages for "user not found" or "wrong password", it tells an attacker which emails are registered. I learned this is called email enumeration and fixed it by returning the same message for both cases.

- I was manually tracking loading, error, and data with three separate useState calls per page. I learned that React Query handles all of that through useQuery, and that useMutation exposes a variables field that tells you which specific item is being mutated, this is a really good improvement since almost every view was working with those states and useQuery already brings all those states in a more efficient way to handle.
