export default function authHeader() {
  const tokenStr = localStorage.getItem("token");
  let token = null;
  if (tokenStr) token = String(tokenStr);

  if (token) {
    return { 'Authorization': "Token " + token };
  } else {
    return {};
  }
}
