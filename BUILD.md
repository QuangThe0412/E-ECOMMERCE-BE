## ▶️ BUILD

npm install pm2 -g

cd ../E-ECOMMERCE-BE

npm run build

pm2 start dist/server.js --name backend-ecommerce

===============
| Lệnh                              | Mô tả                                |
| ---------------------             | ------------------------------------ |
| `pm2 list`                        | Xem danh sách process                |
| `pm2 stop all`                    | Dừng tất cả                          |
| `pm2 restart all`                 | Restart tất cả                       |
| `pm2 restart backend-ecommerce`   | Restart 1 app                        |
| `pm2 delete all`                  | Xóa tất cả khỏi PM2                  |
| `pm2 logs`                        | Xem log realtime                     |
| `pm2 logs backend-ecommerce`      | Log riêng app frontend               |
| `pm2 monit`                       | Giao diện realtime theo dõi CPU, RAM |