FROM nginx:alpine

# Copy landing page
COPY index.html /usr/share/nginx/html/index.html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
