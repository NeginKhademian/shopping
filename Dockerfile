# ---- Base Node Image ----
    FROM node:18-alpine AS base

    # Set working directory
    WORKDIR /app
    
    # Install dependencies using Yarn
    COPY package.json yarn.lock ./
    RUN yarn install
    
    # Copy the rest of the application code
    COPY . .
    
    # Build the Next.js application
    ARG NEXT_PUBLIC_API_BASE_URL
    ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
    RUN yarn build
    
    # ---- Production Image ----
    FROM node:18-alpine AS runner
    
    WORKDIR /app
    
    ENV NODE_ENV production
    
    # Pass environment variables to the runtime container
    ARG NEXT_PUBLIC_API_BASE_URL
    ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
    
    # Only copy necessary files
    COPY --from=base /app/public ./public
    COPY --from=base /app/.next ./.next
    COPY --from=base /app/node_modules ./node_modules
    COPY --from=base /app/package.json ./package.json
    COPY --from=base /app/yarn.lock ./yarn.lock
    
    # Expose the port the app runs on
    EXPOSE 3000
    
    # Start the application
    CMD ["yarn", "start"]