//import { changeProfileImage } from "../../lib/auth.js";
//import { logOut } from "../../lib/auth.js";


export const Feed = () => {
  const rootElement = document.createElement("div");
  rootElement.className = "feed-container"
  rootElement.innerHTML = `
  <aside class="aside" id="aside-um">
  <div class="icon-principal">
  <img src="./images/name-icon.png" alt="">
</div>
  <section class='profile-area'>
    <figure class='profile-area-photo-box'>
      <img class = "photo" id = "photo">
      <input required type="file" id="input-file-profileImg" class='input-file-profileImg transparency'
        accept=".jpg, .jpeg, .png">
        </section>
  <div class="icons">
    <img src="./images/icon-home.png" alt="">
    <span class="text-icon">Inicio</span>

    <img src="./images/icon-settings.png" alt="">
    <span class="text-icon">Perfil </span>

    <img src="./images/icon-dark.png" alt="">
    <button class="text-icon" id="button-dark"> Modo escuro </button>
    <form action="" id="postForm">

    <img src="./images/icon-dark.png" alt="">
    <button class="text-icon" id="button-signout"> Sair </button>
    <form action="" id="postForm">
      </div>
</aside>

<form action = "" id="postForm">
  <textarea id='postText' placeholder='O que você quer compartilhar?'></textarea>
  <button id='publicar'>Publicar</button>
</form>
<section id='postado' class='posts-container'></section>


`
rootElement.querySelector('#postForm').addEventListener('submit', function(event){
event.preventDefault();
const text = rootElement.querySelector('#postText').value;

const postData = () => {
  const data = new Date();
  return data.toLocaleString();
};

const post = {
  text: text,
  user_id: firebase.auth().currentUser.email,
  data: postData(),
  likes: [],
  comments: [],
} 

const postsCollection = firebase.firestore().collection("posts");
postsCollection.add(post).then(()=>{//o then é pra recarregar os posts assim que postar
  rootElement.querySelector("#postText").value= "";
  rootElement.querySelector("#postado").innerHTML = "";
  loadPosts();
  })
})

function addPost(post){
  const postTemplate = `
  <div id="${post.id}" class="div-postados">
    <p class="user-post">Postado por ${post.data().user_id} </br>
    ${post.data().data} </p>
    <p class="txt-post">${post.data().text} </p>
    <div class="edit-area" style = "display:none;">
    <textarea id="edit-area" class="edit-post"></textarea>
    <button id="edit-save" class="button-edit-save"> Salvar </button>
    </div>
    <section class="likes-comments-bar">
      <div class="icones" id="icone-like"><img src="./images/like.png"> ${post.data().likes}</div>
      <div class="icones" id="icone-comment"><img src="./images/comment.png">  ${post.data().comments} </div>
      <button id="editar" class="edit-button" value="${post.id}">Editar</button>
      <button id="deletar" class="delete-button" value="${post.id}"> Deletar</button>
    </section>
    
  </div>
  `

rootElement.querySelector("#postado").innerHTML += postTemplate;

};

function loadPosts() {
  const postsCollection = firebase.firestore().collection("posts").orderBy('data', 'desc')
  postsCollection.get().then(snap => {
    snap.forEach(post => {
      addPost(post);
    })

    const deleteButtons = rootElement.querySelectorAll(".delete-button")
    deleteButtons.forEach(button => {
      button.addEventListener("click", () => {
        const buttonValue = button.value;
        const deleteConfirmation = confirm("Você realmente gostaria de deletar este post?");
        if (deleteConfirmation)
          deletePost(buttonValue);
        else
          return false;
      })
    })

    /*const editButtons = rootElement.querySelectorAll(".edit-button")
    editButtons.forEach(button => {
      button.addEventListener("click", () =>{
        const buttonValue = button.value;
        editPost(buttonValue)
      })
    })*/


    const likeButtons = rootElement.querySelectorAll(".like-button")
    likeButtons.forEach(button => {
      button.addEventListener("click", () => {
        const buttonValue = button.value;
        likePost(buttonValue)
        console.log(buttonValue)
        
      })
    })
  })
}


     
/*function editPost(editedText, postId){//aqui mudar para auth e exportar
  const postsCollection = firebase.firestore().collection("posts")
  postsCollection.doc(postId).update({text : editedText})
}
*/


function deletePost(postId){//aqui mudar para auth e exportar
  const postsCollection = firebase.firestore().collection("posts")
  postsCollection.doc(postId).delete().then(() => {
    rootElement.querySelector("#postado").innerHTML = "";
    loadPosts();
  })
}



function likePost(postId) {//aqui mudar para auth e exportar
  const increment = firebase.firestore.FieldValue.increment(1);
  const postsCollection = firebase.firestore().collection("posts").doc(postId)
  postsCollection.update({likes:increment})
  rootElement.querySelector("#postado").innerHTML = "";
  loadPosts();

} 

loadPosts();
return rootElement;

}







