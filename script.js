// ==== สมัครสมาชิก ====
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    if (!agreeTerms) return showError('กรุณายอมรับข้อกำหนดการใช้งาน');
    if (password.length < 6) return showError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
    if (password !== confirmPassword) return showError('รหัสผ่านไม่ตรงกัน');

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) return showError('อีเมลนี้ถูกใช้ไปแล้ว');
    users.push({ name, email, phone, password });
    localStorage.setItem('users', JSON.stringify(users));
    showSuccess('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
    switchTab('login');
});

function showError(msg) {
    document.getElementById('errorMessage').innerText = msg;
    document.getElementById('successMessage').innerText = '';
}
function showSuccess(msg) {
    document.getElementById('successMessage').innerText = msg;
    document.getElementById('errorMessage').innerText = '';
}

// ==== เข้าสู่ระบบ ====
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return showError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    localStorage.setItem('currentUser', JSON.stringify(user));
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('userName').innerText = user.name;
    document.getElementById('userEmail').innerText = user.email;
});

// ==== สลับแท็บ Login/Register ====
function switchTab(tab) {
    document.getElementById('loginPanel').classList.remove('active');
    document.getElementById('registerPanel').classList.remove('active');
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    if (tab === 'login') {
        document.getElementById('loginPanel').classList.add('active');
        document.querySelectorAll('.tab-button')[0].classList.add('active');
    } else {
        document.getElementById('registerPanel').classList.add('active');
        document.querySelectorAll('.tab-button')[1].classList.add('active');
    }
    showError('');
    showSuccess('');
}

// ==== ออกจากระบบ ====
function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('authPage').style.display = 'block';
    document.getElementById('mainApp').style.display = 'none';
}

// ==== สร้างไซส์รองเท้า ====
window.onload = function() {
    const sizeGrid = document.getElementById('sizeGrid');
let sizeHTML = '';
for(let size=7; size<=12; size+=0.5){
  sizeHTML += `<label><input type="radio" name="shoeSize" value="${size}"> ${size}</label>`;
}
sizeGrid.innerHTML = sizeHTML;

    }

    updateQueueList();

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        document.getElementById('authPage').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        const user = JSON.parse(currentUser);
        document.getElementById('userName').innerText = user.name;
        document.getElementById('userEmail').innerText = user.email;
    } else {
        document.getElementById('authPage').style.display = 'block';
        document.getElementById('mainApp').style.display = 'none';
    }


// ==== สั่งจองรองเท้า ====
document.getElementById('orderForm').addEventListener('submit', function(e) {
e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return alert('กรุณาเข้าสู่ระบบก่อนสั่งจอง');

    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const province = document.getElementById('customerProvince').value;
    const size = document.querySelector('.size-grid input[type="radio"]:checked')?.value;
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString('th-TH', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});


    if (!size) return alert('กรุณาเลือกไซส์รองเท้า');

    // ✅ ส่งข้อมูลไปยัง Google Apps Script Web App
    fetch("https://script.google.com/macros/s/AKfycbwKIEivQZTIAUH66v1gIxdUv5EwxhzGxHSdEiW3XkmCJLY0Cfe-I14hsg4zCtfV7D4Q/exec", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
  body: JSON.stringify({
  name: name,
  email: email,
  phone: phone,
  province: province,
  zipcode: zipcode,
  size: size,
  product: product,
  code: codeMap[product] || '',
  date: date,
  time: time
})



    })
    .then(res => res.text())
    .then(txt => {
        alert("จองสำเร็จ! ขอบคุณที่ใช้บริการ");
        document.getElementById('orderForm').reset();
    })
    .catch(err => {
        alert("เกิดข้อผิดพลาดในการจอง: " + err.message);
    });
});
    