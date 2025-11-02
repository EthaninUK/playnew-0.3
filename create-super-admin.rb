# 创建 SuperAdmin 用户
begin
  u = User.find_or_initialize_by(email: 'the_uk1@outlook.com')
  u.name = 'Admin'
  u.password = 'Mygcdjmyxzg2026!'
  u.password_confirmation = 'Mygcdjmyxzg2026!'
  u.type = 'SuperAdmin'
  u.skip_confirmation!
  u.save!

  puts "✓ SuperAdmin created successfully"
  puts "  Email: #{u.email}"
  puts "  Type: #{u.type}"
  puts "  Confirmed: #{u.confirmed?}"
rescue => e
  puts "✗ Error: #{e.message}"
  puts e.backtrace.first(3).join("\n")
end
