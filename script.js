// Backend URL - deploy qilgandan keyin bu yerga o'zgartirasiz
const BACKEND_URL = 'http://localhost:5000'; // Lokal test uchun
// const BACKEND_URL = 'https://sizning-app.onrender.com'; // Deploy qilgandan keyin

// Telegram Bot konfiguratsiyasi
const TELEGRAM_BOT_TOKEN = '8561049037:AAEbMoh0BTPRx5mUR99ui-uyg764vGO8spY';
const TELEGRAM_CHAT_ID = '7123672881';

// Admin paroli
const ADMIN_PASSWORD = 'admin123';

// Elementlar
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const mainForm = document.getElementById('mainForm');
const backBtn = document.getElementById('backBtn');
const timeButtons = document.querySelectorAll('.time-btn');
const uploadArea = document.getElementById('uploadArea');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeImageBtn = document.getElementById('removeImage');
const verificationInput = document.getElementById('verificationCode');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitLoader = document.getElementById('submitLoader');
const successMessage = document.getElementById('successMessage');

// Admin elementlar
const fullNameSelect = document.getElementById('fullName');
const dateGroup = document.getElementById('dateGroup');
const timeGroup = document.getElementById('timeGroup');
const dateInput = document.getElementById('date');
const adminPasswordModal = document.getElementById('adminPasswordModal');
const adminPasswordInput = document.getElementById('adminPassword');
const passwordError = document.getElementById('passwordError');
const cancelAdminBtn = document.getElementById('cancelAdminBtn');
const confirmAdminBtn = document.getElementById('confirmAdminBtn');
const adminPage = document.getElementById('adminPage');
const logoutBtn = document.getElementById('logoutBtn');
const downloadReportBtn = document.getElementById('downloadReportBtn');

// Ma'lumotlarni saqlash
let formData = {
    fullName: '',
    date: '',
    timeSlot: '',
    image: null,
    imageBase64: null
};

// Bugungi sanani default qilib o'rnatish va sana cheklash
const today = new Date();
dateInput.valueAsDate = today;

// Maksimal sana - bugun
const maxDate = new Date();
dateInput.max = maxDate.toISOString().split('T')[0];

// Minimal sana - 3 kun oldin
const minDate = new Date();
minDate.setDate(minDate.getDate() - 3);
dateInput.min = minDate.toISOString().split('T')[0];

// Foydalanuvchi tanlaganda sana va muddat yashirish/ko'rsatish
fullNameSelect.addEventListener('change', (e) => {
    const isAdmin = e.target.value === 'admin';
    
    if (isAdmin) {
        // Admin tanlangan - sana va muddat yashiriladi
        dateGroup.classList.add('hidden');
        timeGroup.classList.add('hidden');
        dateInput.removeAttribute('required');
        document.getElementById('timeSlot').removeAttribute('required');
    } else {
        // Oddiy foydalanuvchi - sana va muddat ko'rinadi
        dateGroup.classList.remove('hidden');
        timeGroup.classList.remove('hidden');
        dateInput.setAttribute('required', 'required');
        document.getElementById('timeSlot').setAttribute('required', 'required');
    }
});

// Muddat tugmalarini boshqarish
timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        timeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('timeSlot').value = btn.dataset.time;
    });
});

// Forma jo'natish (1-bosqich)
mainForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const selectedUser = fullNameSelect.value;
    
    // Agar admin tanlangan bo'lsa, parol so'rash
    if (selectedUser === 'admin') {
        adminPasswordModal.classList.remove('hidden');
        setTimeout(() => {
            adminPasswordModal.classList.add('show');
            adminPasswordInput.focus();
        }, 10);
        return;
    }
    
    // Oddiy foydalanuvchi uchun davom etish
    proceedToStep2();
});

// Step 2 ga o'tish funksiyasi
function proceedToStep2() {
    formData.fullName = document.getElementById('fullName').value;
    formData.date = document.getElementById('date').value;
    formData.timeSlot = document.getElementById('timeSlot').value;
    
    // Ma'lumotlarni ko'rsatish
    document.getElementById('displayName').textContent = formData.fullName;
    document.getElementById('displayDate').textContent = formatDate(formData.date);
    document.getElementById('displayTime').textContent = formData.timeSlot.charAt(0).toUpperCase() + formData.timeSlot.slice(1);
    
    // 2-bosqichga o'tish
    step1.classList.remove('active');
    setTimeout(() => {
        step2.classList.add('active');
    }, 100);
}

// Admin parol modal - bekor qilish
cancelAdminBtn.addEventListener('click', () => {
    adminPasswordModal.classList.remove('show');
    setTimeout(() => {
        adminPasswordModal.classList.add('hidden');
        adminPasswordInput.value = '';
        passwordError.classList.add('hidden');
    }, 300);
});

// Admin parol modal - tasdiqlash
confirmAdminBtn.addEventListener('click', () => {
    checkAdminPassword();
});

// Enter tugmasi bilan parolni tasdiqlash
adminPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAdminPassword();
    }
});

// Parolni tekshirish
function checkAdminPassword() {
    const enteredPassword = adminPasswordInput.value;
    
    if (enteredPassword === ADMIN_PASSWORD) {
        // To'g'ri parol - admin sahifasiga o'tish
        adminPasswordModal.classList.remove('show');
        setTimeout(() => {
            adminPasswordModal.classList.add('hidden');
            adminPasswordInput.value = '';
            passwordError.classList.add('hidden');
            
            // Barcha step larni yashirish
            step1.classList.remove('active');
            step2.classList.remove('active');
            
            // Admin sahifasini ko'rsatish
            adminPage.classList.remove('hidden');
            setTimeout(() => {
                adminPage.classList.add('show');
            }, 100);
        }, 300);
    } else {
        // Noto'g'ri parol
        passwordError.classList.remove('hidden');
        adminPasswordInput.value = '';
        adminPasswordInput.focus();
    }
}

// Admin sahifasidan chiqish
logoutBtn.addEventListener('click', () => {
    adminPage.classList.remove('show');
    setTimeout(() => {
        adminPage.classList.add('hidden');
        resetForm();
        step1.classList.add('active');
    }, 300);
});

// Hisobot yuklab olish
downloadReportBtn.addEventListener('click', async () => {
    try {
        // Tanlangan foydalanuvchilarni olish
        const selectedUsers = Array.from(document.querySelectorAll('.user-checkbox:checked'))
            .map(cb => cb.value);
        
        const startDateInput = document.getElementById('startDate').value;
        const endDateInput = document.getElementById('endDate').value;
        
        // Sanalarni readable formatga o'zgartirish
        const startDate = startDateInput ? convertDateToReadable(startDateInput) : '';
        const endDate = endDateInput ? convertDateToReadable(endDateInput) : '';
        
        // Loading holatini ko'rsatish
        downloadReportBtn.disabled = true;
        const originalHTML = downloadReportBtn.innerHTML;
        downloadReportBtn.innerHTML = `
            <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            Yuklanmoqda...
        `;
        
        // Backend dan Excel olish
        const response = await fetch(`${BACKEND_URL}/api/download-excel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                start_date: startDate,
                end_date: endDate,
                users: selectedUsers.length > 0 ? selectedUsers : null
            })
        });
        
        if (!response.ok) {
            throw new Error('Hisobot yuklab olishda xatolik');
        }
        
        // Excel faylni yuklab olish
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hisobot_${new Date().getTime()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Buttonni tiklash
        downloadReportBtn.disabled = false;
        downloadReportBtn.innerHTML = originalHTML;
        
    } catch (error) {
        console.error('Xatolik:', error);
        alert('Hisobotni yuklab olishda xatolik yuz berdi. Backend ishlab turganini tekshiring.\n\nXatolik: ' + error.message);
        
        // Buttonni tiklash
        downloadReportBtn.disabled = false;
        downloadReportBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Hisobotni yuklab olish
        `;
    }
});

// Orqaga qaytish
backBtn.addEventListener('click', () => {
    step2.classList.remove('active');
    setTimeout(() => {
        step1.classList.add('active');
    }, 100);
});

// Rasm yuklash
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('Rasm hajmi 5MB dan oshmasligi kerak');
            return;
        }
        
        formData.image = file;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            previewImg.src = event.target.result;
            uploadArea.classList.add('hidden');
            imagePreview.classList.remove('hidden');
            formData.imageBase64 = event.target.result;
            checkFormValidity();
        };
        reader.readAsDataURL(file);
    }
});

// Rasmni o'chirish
removeImageBtn.addEventListener('click', () => {
    imageUpload.value = '';
    imagePreview.classList.add('hidden');
    uploadArea.classList.remove('hidden');
    formData.image = null;
    formData.imageBase64 = null;
    checkFormValidity();
});

// Verifikatsiya kod tekshirish
verificationInput.addEventListener('input', () => {
    checkFormValidity();
});

// Forma to'ldirish holatini tekshirish
function checkFormValidity() {
    const isValid = formData.imageBase64 && 
                   verificationInput.value.trim() !== '';
    submitBtn.disabled = !isValid;
}

// Sanani formatlash
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 
                    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

// Sana ni YYYY-MM-DD dan readable formatga o'zgartirish
function convertDateToReadable(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    const year = parts[0];
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 
                    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    
    return `${day} ${months[month - 1]} ${year}`;
}

// Telegram botga jo'natish
submitBtn.addEventListener('click', async () => {
    // Yuklash holatini ko'rsatish
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitLoader.classList.remove('hidden');
    
    try {
        // 1. Backend ga ma'lumot yuborish
        const backendData = {
            foydalanuvchi: formData.fullName,
            sana: formatDate(formData.date),
            muddat: formData.timeSlot,
            raqam: verificationInput.value
        };
        
        const backendResponse = await fetch(`${BACKEND_URL}/api/add-entry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(backendData)
        });
        
        if (!backendResponse.ok) {
            throw new Error('Backend ga yuborishda xatolik');
        }
        
        // 2. Telegram ga matnli xabar
        const message = `
🆕 Yangi ro'yxatdan o'tish

👤 Foydalanuvchi: ${formData.fullName}
📅 Sana: ${formatDate(formData.date)}
⏰ Muddat: ${formData.timeSlot.charAt(0).toUpperCase() + formData.timeSlot.slice(1)}
🔢 Raqam: ${verificationInput.value}
        `;
        
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        // 3. Rasm bor bo'lsa, uni jo'natish
        if (formData.imageBase64) {
            const base64Data = formData.imageBase64.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: formData.image.type });
            
            const imageCaption = `👤 ${formData.fullName}
📅 ${formatDate(formData.date)}
⏰ ${formData.timeSlot.charAt(0).toUpperCase() + formData.timeSlot.slice(1)}
🔢 ${verificationInput.value}
📎 Fayl: ${formData.image.name}`;
            
            const formDataTelegram = new FormData();
            formDataTelegram.append('chat_id', TELEGRAM_CHAT_ID);
            formDataTelegram.append('photo', blob, formData.image.name);
            formDataTelegram.append('caption', imageCaption);
            
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formDataTelegram
            });
        }
        
        // Muvaffaqiyatli xabar
        step2.classList.remove('active');
        successMessage.classList.remove('hidden');
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 100);
        
        // 3 soniyadan keyin formani tozalash va qaytadan boshlash
        setTimeout(() => {
            resetForm();
        }, 3000);
        
    } catch (error) {
        console.error('Xatolik:', error);
        alert('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
        submitText.style.display = 'inline';
        submitLoader.classList.add('hidden');
        submitBtn.disabled = false;
    }
});

// Formani tozalash
function resetForm() {
    // Ma'lumotlarni tozalash
    formData = {
        fullName: '',
        date: '',
        timeSlot: '',
        image: null,
        imageBase64: null
    };
    
    // Formani tozalash
    mainForm.reset();
    document.getElementById('date').valueAsDate = new Date();
    timeButtons.forEach(b => b.classList.remove('active'));
    imageUpload.value = '';
    imagePreview.classList.add('hidden');
    uploadArea.classList.remove('hidden');
    verificationInput.value = '';
    
    // Holatni tiklash
    successMessage.classList.remove('show');
    setTimeout(() => {
        successMessage.classList.add('hidden');
        step1.classList.add('active');
    }, 300);
    
    submitText.style.display = 'inline';
    submitLoader.classList.add('hidden');
    submitBtn.disabled = true;
}
