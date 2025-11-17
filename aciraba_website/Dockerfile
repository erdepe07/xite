FROM php:8.2-apache

# Install ekstensi PHP & dependencies
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    unzip git pkg-config build-essential zlib1g-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd intl mbstring mysqli pdo pdo_mysql zip xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Aktifkan mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy composer.json & composer.lock dulu (biar caching build cepat)
COPY composer.json composer.lock ./

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install dependencies PHP
RUN composer update && composer install --no-dev --optimize-autoloader

# Copy source code
COPY . .

# Set writable permissions (development only)
RUN chown -R www-data:www-data writable \
    && chmod -R 777 writable

# Set DocumentRoot ke /public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# Update config Apache agar pakai /public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
    && sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

EXPOSE 80
CMD ["apache2-foreground"]