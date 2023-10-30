import Api from "./Api";

export default {
  register(credentials) {
    return Api().post("register", credentials);
  },
  login(credentials) {
    return Api().post("login", credentials);
  },
  getUser(id) {
    return Api().get(`${id}`);
  },
  getUsers() {
    return Api().get();
  },
  getUserRequest(id) {
    return Api().get(`/frients/${id}`);
  },
  addAFrient(id, idRequest) {
    return Api().post(`/frients/${id}`, idRequest);
  },
  uploadAvata(formData) {
    return Api().post("/information/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  uploadImgPost(formData) {
    return Api().post("/status/img", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
};
