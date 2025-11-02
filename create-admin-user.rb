# 创建管理员用户（方法 B）
begin
  user = User.create!(
    name: "Admin",
    email: "admin@playnew.ai",
    password: "Admin123456!",
    password_confirmation: "Admin123456!",
    confirmed_at: Time.zone.now
  )

  puts "✓ 用户创建成功！"
  puts "  邮箱: #{user.email}"
  puts "  ID: #{user.id}"
  puts "  已确认: #{user.confirmed?}"
  puts ""
  puts "现在可以访问 http://localhost:3002/app/login 登录"
rescue => e
  puts "✗ 错误: #{e.message}"
end
