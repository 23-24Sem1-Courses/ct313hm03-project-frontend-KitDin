<template>
    <div class="CommentPost-container">
        <div style="display: flex;">


            <div class="HC-Post-imgs" ref="imageContainer">
                <div class="img-container" v-for="(img, index) in postId.images" :key="index">
                    <img :src="loadImgPost(img)" class="img">
                </div>

            </div>

            <div class="comment">
                <div class="user">
                    <img class="user-Avatar" :src="loadImgUser(postId.content)" alt="">
                    <p class="user-name">{{ postId.content.USER_NickName }}</p>
                </div>
                <hr>

                <!-- comment -->
                <div class="frame">
                    <div class="user-comment">
                        <div class="user">
                            <img class="user-Avatar" src="../../../server/public/uploads/avatar/user17.png" alt="">
                            <p class="user-name">lau.vn</p>
                            <p class="content-comment">Đep quá nè</p>
                        </div>
                        <div class="reply">
                            <p class="time">7h</p>
                            <p class="btn-reply">Reply</p>
                        </div>

                        <div class="reply-content">
                            <hr>
                            <p class="view-option" v-if="!isShowView" @click="showView">View replies (1)</p>
                            <p class="view-option" v-if="isShowView" @click="showView">Hide</p>
                            <div class="user" v-if="isShowView">
                                <img class="user-Avatar" src="../../../server/public/uploads/avatar/user18.png" alt="">
                                <p class="user-name">imKuer.vn</p>
                                <p class="content-comment"> <span class="tag-name">@lau.vn</span> Cảm ơn nhé</p>
                            </div>
                        </div>
                    </div>


                </div>
                <!--   end commet -->
                <hr>
                <div class="excute">
                    <div class="icons">
                        <i @click="like(postId)"
                            :class="['bi', 'icon', { 'bi-heart': !postId.isHeartFilled, 'bi-heart-fill': postId.isHeartFilled }]"></i>

                        <i class="bi bi-chat icon"></i>
                    </div>
                    <div class="about">
                        <h5>{{ postId.countLike }} likes</h5>
                        <p>{{ timeRequest(postId.content.POST_Time) }}
                        </p>
                    </div>
                    <div class="addComment">
                        <input v-model="textComment" type="text" placeholder="Add a comment...">
                        <button :class="char > 0 ? 'btn-active' : ``" class="btn-post"
                            @click="char > 0 ? postComment() : null">Post</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script >
import { ref } from 'vue';
import AuthenticationService from "../services/AuthenticationService"


export default {
    data() {
        return {
            isShowView: false,
            textComment: '',
            char: 0,
        };
    },
    methods: {
        showView() {
            this.isShowView = !this.isShowView
        }, postComment() {
            console.log(this.textComment);
        }, async like(post) {
            post.isHeartFilled = !post.isHeartFilled
            try {

                if (post.isHeartFilled) {
                    console.log("like");

                    await AuthenticationService.like(this.userid, {
                        POST_Id: post.content.POST_Id
                    });
                } else if (!post.isHeartFilled) {
                    console.log("un like");

                    await AuthenticationService.unlike(this.userid, {
                        POST_Id: post.content.POST_Id
                    });
                }

                const [updatedPostData] = (await AuthenticationService.APost(post.content.POST_Id)).data;
                const isCurrentUserLiked = updatedPostData.likes.includes(this.userid);

                this.postId = {
                    ...updatedPostData,
                    isHeartFilled: isCurrentUserLiked,
                    activeIndex: 0,
                    scrollTimeout: null,
                    showFullContent: this.isContentOverFifteenWords(updatedPostData.content.POST_Content)
                }
                this.$emit('updatePost', this.postId)
            } catch (error) { }
        }, isContentOverFifteenWords(content) {
            const words = content.split(' '); // Tách chuỗi thành mảng các từ
            return words.length > 15; // Kiểm tra xem mảng có nhiều hơn 15 từ hay không
        }
    }, props: {
        userid: String,
        postId: Object,
        loadImgPost: Function,
        loadImgUser: Function,
        timeRequest: Function,
        // toggleHeart: Function
    }, mounted() {
        // console.log(this.postId);
    }, watch: {
        textComment(value) {
            this.char = value.length;
        },
    }
}
</script>

<style>
.CommentPost-container {
    width: 75%;
    height: 90%;
    background-color: white;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10001;
}

.HC-Post-imgs::-webkit-scrollbar {
    display: none;
}

.HC-Post-imgs {
    width: 584px;
    height: 655.5px;
    display: flex;
    align-items: center;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.HC-Post-imgs .img-container {
    flex-shrink: 0;
    scroll-snap-align: start;
}

.HC-Post-imgs .img-container .img {
    width: 584px;
    height: 655.5px;
    object-fit: cover;
    margin: 0;
}



.comment {
    border-left: 1px silver solid;
    width: 486px;
    /* height: 655.5px; */
    height: 655.5px;
}

.comment .frame {
    overflow-y: scroll;
    scrollbar-width: none;
    width: 486px;
    /* height: 655.5px; */
    height: 450px;
}


.comment .frame::-webkit-scrollbar {
    display: none;
}

.comment .user {
    width: 470px;
    height: fit-content;
    display: flex;
    padding: 10px 15px 10px 20px;
}

hr {
    padding: 0;
    margin: 0;
    opacity: .1;
}

.comment .user .user-Avatar {
    width: 38px;
    height: 38px;
    object-fit: cover;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 5px;
}

.comment .user .user-name {
    margin: 0;
    font-size: 13px;
    text-align: center;
    position: relative;
    top: 50%;
    transform: translate(10px, 10px);
    font-weight: 600;
    cursor: pointer;
}

.comment .user .content-comment {
    position: relative;
    top: 50%;
    transform: translate(10px, 10px);
    margin-left: 3px;
}

.comment .user .content-comment .tag-name {
    color: rgb(17, 64, 151);
    cursor: pointer;
}

.user-comment {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    font-size: 13px;
}



.user-comment .reply {
    display: flex;
    position: relative;
    width: 50px;
    top: -18px;
    left: 72px;
    color: #737373;
}

.user-comment .reply .time {
    margin-right: 15px;
}

.user-comment .reply .btn-reply {
    cursor: pointer;
}

.user-comment .reply-content {
    margin: 0;
    position: relative;
    left: 72px;
    top: -12px;
    width: 30%;
}

.user-comment .reply-content hr {
    width: 24px;
    opacity: 1;
}

.user-comment .reply-content .view-option {
    margin: 0;
    margin-left: 48px;
    position: absolute;
    top: -10px;
    color: #737373;
    font-weight: 500;
    cursor: pointer;
}

.reply-content .user {
    margin: 0;
    padding: 25px 0 0 0;
}

.excute {
    height: 145.5px;
    /* margin: 18px 22px; */
}

.excute .icons {
    margin: 0;
    padding: 12px 22px 8px 22px;
    font-size: 24px;
    -webkit-text-stroke: 0.7px;
}

.excute .icons .icon {
    padding-right: 8px;
}

.excute .icons .bi-heart-fill {
    color: red;
}

.excute .about {
    font-size: 14px;
    margin: 0;
    padding: 0 22px 10px 22px;
}

.excute .about h5 {
    margin: 0;
    font-size: 14px;
    font-weight: bold;
}

.excute .about p {
    margin: 0;
    font-size: 10px;
    color: silver;
}

.excute .addComment {
    border-top: #eae8e8 1px solid;
    padding: 12px 0 0 0;
    display: flex;
    justify-content: space-between;
}

.excute .addComment input {
    margin-left: 22px;
    border: none;
    font-size: 14px;
    width: 90%;
}

.excute .addComment .btn-post {
    border: none;
    padding-right: 22px;
    background-color: white;
    font-weight: bolder;
    color: rgb(186, 196, 215);
}

.btn-active {
    color: rgb(17, 64, 151) !important;
}
</style>
<!-- <div class="about">
                        <h5>115 likes</h5>
                        <p>OCTOBER 24</p>
                    </div>
<div class="addComment">
                        <input type="text" placeholder="Add a comment...">
                        <button class="btn-post">Post</button>
                    </div> -->