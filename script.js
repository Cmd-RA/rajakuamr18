const RENDER_URL = "https://my-secret-engine.onrender.com"; // आपका रेंडर इंजन

// लॉगिन और रजिस्टर संभालना
function handleAuth() {
    const phone = document.getElementById('phone').value;
    const pass = document.getElementById('pass').value;

    if(phone.length < 10) return alert("सही मोबाइल नंबर डालें!");
    
    // डेटा को ब्राउज़र में सेव करना (यही आपकी आईडी होगी)
    localStorage.setItem("user_phone", phone);
    localStorage.setItem("isLoggedIn", "true");
    
    checkLogin();
    alert("लॉगिन सफल! अब आप वीडियो डाल सकते हैं।");
}

function checkLogin() {
    if(localStorage.getItem("isLoggedIn") === "true") {
        document.getElementById('authBox').style.display = 'none';
        document.getElementById('uploadBox').style.display = 'block';
        document.getElementById('userHeader').innerHTML = `<span>👤 ${localStorage.getItem("user_phone")}</span>`;
    }
}

// वीडियो अपलोड करना (सीधा रेंडर इंजन को)
async function uploadVideo() {
    const fileInput = document.getElementById('videoFile');
    const file = fileInput.files[0];
    const user = localStorage.getItem("user_phone");

    if (!file) return alert("भाई, वीडियो तो चुनो!");

    const formData = new FormData();
    formData.append('video', file);
    formData.append('user', user);

    alert("इंजन स्टार्ट हो गया है... टेलीग्राम पर वीडियो भेजा जा रहा है।");

    try {
        const response = await fetch(`${RENDER_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            alert("बधाई हो! वीडियो बोट ने चैनल पर डाल दिया है।");
        } else {
            alert("अपलोड फेल: " + data.error);
        }
    } catch (err) {
        alert("रेंडर इंजन से जुड़ने में दिक्कत आ रही है!");
    }
}

// पेज लोड होते ही लॉगिन चेक करना
window.onload = checkLogin;
