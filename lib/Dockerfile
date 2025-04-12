FROM quay.io/loki-xer/jarvis-md:latest
RUN git clone https://github.com/godzenitsu/NEZUKO-BOT /root/nezuko/
WORKDIR /root/nezuko/
RUN yarn install --network-concurrency 1
CMD ["npm", "start"]
