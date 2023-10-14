const API_URL = "https://sissai-api.magiadigital.com";
const LOGIN_URL = "/api/v1/e-commerce/login";
const GET_URL = "/api/v1/e-commerce/detalle-proceso/";
const EMAIL = "integracion@magiadigital.com";
const CONTRASEÑA = "DE2J(jwauNLvpC%V";
const CAPTCHA_RESPONSE = "";


const consultaForm = document.getElementById('consultaForm');
const parametroConsulta = document.getElementById('parametroConsulta');
const resultadoConsulta = document.getElementById('resultadoConsulta');


consultaForm.addEventListener('submit', function (e) {
    e.preventDefault();


    // Realiza la solicitud de inicio de sesión y obtención de token
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const token = response.token;


            // Utiliza el token para hacer la solicitud GET con el código ingresado
            const xhrGet = new XMLHttpRequest();
            xhrGet.addEventListener('load', function () {
                if (xhrGet.readyState === 4 && xhrGet.status === 200) {
                    const data = JSON.parse(xhrGet.responseText);
                    resultadoConsulta.innerHTML = JSON.stringify(data, null, 2);
                } else {
                    resultadoConsulta.innerHTML = 'Error al consultar el código.';
                }
            });
            xhrGet.open('GET', `${API_URL}${GET_URL}${parametroConsulta.value}`);
            xhrGet.setRequestHeader('Authorization', `Bearer ${token}`);
            xhrGet.send();
        } else {
            resultadoConsulta.innerHTML = 'Error al iniciar sesión.';
        }
    });
    xhr.open('POST', `${API_URL}${LOGIN_URL}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ email: EMAIL, password: CONTRASEÑA, captchaResponse: CAPTCHA_RESPONSE }));
});
