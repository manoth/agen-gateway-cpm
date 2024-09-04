FROM node:18-alpine

# ตั้งค่าไดเรกทอรีทำงานใน container
WORKDIR /home/api

# อัพเดตและติดตั้ง dependencies ที่จำเป็นในหนึ่งคำสั่งเดียว
RUN apk update && apk upgrade && apk add --no-cache \
    alpine-sdk \
    git \
    openssh \
    python3 \
    tzdata \
    build-base \
    libtool \
    autoconf \
    automake \
    gzip \
    g++ \
    make \
    screen && \
    cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && \
    echo "Asia/Bangkok" > /etc/timezone

# คัดลอกโค้ดทั้งหมดไปยัง container
COPY . .

# ติดตั้ง dependencies
RUN npm i && npm install pm2 typescript -g && tsc

# เปิดพอร์ตที่ต้องการใช้งาน
EXPOSE 3000

# รันคำสั่งเพื่อเริ่มโปรเจ็กต์
CMD ["pm2-runtime", "pm2.json"]