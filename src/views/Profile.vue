<template>
    <div class="profile-frame">
        <div v-if="showLoader" class="loader"></div>
        <Nav></Nav>
        <div class="profile-contents">
            <div v-if="!isCurrentUser">
                <div class="pc-infor">
                    <div class="img">
                        <img class="pc-infor-avt" :src="loadimg(user_other)" alt="">
                        <!-- <img class="pc-infor-avt" :src="loadimgserver" alt=""> -->
                    </div>
                    <div class="contents">
                        <div class="pc-infor-nickname">
                            <p class="nickname">{{ user_other.USER_NickName }}</p>
                            <button class="add">Add</button>
                            <button class="mess">Message</button>
                        </div>
                        <div class="pc-infor-social">
                            <p class="posts"><b>0</b> posts</p>
                            <p class="followers"><b>1B</b> followers</p>
                            <p class="friends"><b>12</b> friends</p>
                        </div>
                        <h6 class="pc-infor-fullname">{{ user_other.USER_SubName + " " + user_other.USER_FirstName }}
                        </h6>
                        <p class="pc-infor-about">
                            Hello, wc to my profile!
                            Add me if you want
                        </p>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="pc-infor">
                    <div class="img">
                        <img class="pc-infor-avt" :src="loadimg(user_personal)" alt="">
                    </div>
                    <div class="contents">
                        <div class="pc-infor-nickname">
                            <p class="nickname">{{ user_personal.USER_NickName }}</p>
                            <button class="mess">Edit profile</button>
                            <button class="mess">Log out</button>
                        </div>
                        <div class="pc-infor-social">
                            <p class="posts"><b>0</b> posts</p>
                            <p class="followers"><b>1B</b> followers</p>
                            <p class="friends"><b>12</b> friends</p>
                        </div>
                        <h6 class="pc-infor-fullname">{{ user_personal.USER_SubName + " " + user_personal.USER_FirstName
                        }}
                        </h6>
                        <p class="pc-infor-about">
                            Hello, wc to my profile!
                            Add me if you want
                        </p>
                    </div>
                </div>
            </div>



            <div class="list">

                <div @mouseover="setPostHoverState(post.id, true)" @mouseout="setPostHoverState(post.id, false)"
                    class="listpost" v-for="(post, index) in posts" :key="post.id">
                    <div class="display-none" :class="{ 'hover': postHoverStates[index] }">
                        <i class="bi bi-heart-fill icon-hover"></i>
                        <span class="like">{{ post.like }}</span>
                        <i class="bi bi-chat-fill icon-hover"></i>
                        <span class="comment">{{ post.comment }}</span>
                    </div>
                    <img class="imgp" :src="loadimg(post)" alt="">
                    <i class="bi bi-images icon"></i>
                </div>
            </div>
        </div>
        <Footer class="footer"></Footer>
    </div>
</template>

<script>
import Nav from '../components/Nav'
import Footer from '../components/Footer.vue'
import AuthenticationService from '../services/AuthenticationService'

export default {
    data() {
        return {
            user_other_params_id: this.$router.history.current.params.idother ? this.$router.history.current.params.idother : '',
            user_other: [],
            user_personal: [],
            user_personal_params_id: this.$router.history.current.params.id,
            postHoverStates: [],
            isCurrentUser: true,
            showLoader: false,
            posts: [
                { id: 1, USER_AvatarURL: "user1.png", like: 17, comment: 9 },
                { id: 2, USER_AvatarURL: "user2.png", like: 18, comment: 9 },
                { id: 3, USER_AvatarURL: "user3.png", like: 19, comment: 9 },
                { id: 4, USER_AvatarURL: "user4.png", like: 1, comment: 9 },
                { id: 5, USER_AvatarURL: "user5.png", like: 12, comment: 9 },
                { id: 6, USER_AvatarURL: "user6.png", like: 18, comment: 9 },
                { id: 7, USER_AvatarURL: "user7.png", like: 110, comment: 9 },
                { id: 8, USER_AvatarURL: "user8.png", like: 8, comment: 9 },
                { id: 9, USER_AvatarURL: "user9.png", like: 7, comment: 9 },
                { id: 11, USER_AvatarURL: "user10.png", like: 17, comment: 9 },
                { id: 12, USER_AvatarURL: "user11.png", like: 0, comment: 9 },
                { id: 13, USER_AvatarURL: "user12.png", like: 0, comment: 9 },
                { id: 14, USER_AvatarURL: "user13.png", like: 7, comment: 9 },
                { id: 15, USER_AvatarURL: "user14.png", like: 9, comment: 9 },
                { id: 16, USER_AvatarURL: "user15.png", like: 78, comment: 9 },
                { id: 17, USER_AvatarURL: "user16.png", like: 9, comment: 9 },
                { id: 18, USER_AvatarURL: "user17.png", like: 5, comment: 9 },
                { id: 19, USER_AvatarURL: "user18.png", like: 2, comment: 9 },
            ]
        }
    }, components: {
        Nav, Footer
    }, methods: {
        loadimg(user) {
            if (user && user.USER_AvatarURL) {
                return require(`../../../server/public/uploads/avatar/${user.USER_AvatarURL}`);
            }
        },
        setPostHoverState(postId, isHovered) {
            const index = this.posts.findIndex(post => post.id === postId);
            this.$set(this.postHoverStates, index, isHovered);
        },
    }, async mounted() {
        this.postHoverStates = new Array(this.posts.length).fill(false)
        if (this.$route.params.idother) {
            // Nếu có route param idother, bạn đang xem trang cá nhân của người khác
            this.user_other = (await AuthenticationService.getUser(this.$route.params.idother)).data;
            this.isCurrentUser = false;
            console.log(this.$route.params.idother)
        } else {
            // Nếu không có route param idother, bạn đang xem trang cá nhân của người dùng hiện tại
            this.user_personal = (await AuthenticationService.getUser(this.$route.params.id)).data;
            this.isCurrentUser = true;
            console.log(this.$route.params.id)
        }
    }, computed: {
        currentPosts() {
            return this.isCurrentUser ? this.user_personal.posts : this.user_other.posts;
        }
    }, watch: {
        '$route.params': {
            async handler(newParams, oldParams) {
                if (newParams.idother) {
                    this.isCurrentUser = false;
                } else {
                    this.isCurrentUser = true;
                }
                this.showLoader = true
                setTimeout(async () => {
                    window.location.reload();
                    setTimeout(() => {
                        this.showLoader = false
                    }, 0);
                }, Math.random() * (750 - 250) + 250);
            },
            deep: true
        }
    }, beforeRouteLeave(to, from, next) {
        // Show a loader before leaving the current page
        this.showLoader = true;

        // Continue the route navigation
        next();
    },

}
</script>


<style scoped>
.display-none {
    display: none;
}

.loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background-image: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.8));
    background-size: 200% 100%;
    animation: loading 2s linear infinite;
    z-index: 9999999999999999999999999999999999999999999999;
    /* display: none; */
    /* Bắt đầu ẩn đi */
}

@keyframes loading {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}


.profile-contents {
    position: relative;
    left: 246px;
    width: 1024px;
    margin: 0 100px;
    padding: 30px 20px 30px;



    .pc-infor {
        width: 100%;
        display: flex;
        margin-bottom: 20px;
        justify-content: flex-start;
        text-align: center;
        border-bottom: 1px solid #bebfbf;

        .img {
            width: 292px;
            height: 161px;
            margin: 0 30px 0 0;

            .pc-infor-avt {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                object-fit: cover;
                z-index: 0;
            }
        }

        .contents {
            margin: 0;
            z-index: 0;

            .pc-infor-nickname {
                display: flex;
                height: 48px;
                margin-bottom: 12px;

                .nickname {
                    font-size: 20px;
                    padding-right: 80px;
                }

                .add {
                    height: 32px;
                    width: fit-content;
                    padding: 7px 16px;
                    background-color: #0095F6;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: bold;
                    font-size: 14px;

                    &:hover {
                        background-color: #0571b9;
                    }
                }

                .mess {
                    color: black;
                    background-color: #d2d2d2;
                    height: 32px;
                    margin-left: 8px;
                    width: fit-content;
                    padding: 7px 16px;
                    border: none;
                    border-radius: 12px;
                    font-weight: bold;
                    font-size: 14px;

                    &:hover {
                        background-color: #bebfbf;
                    }
                }
            }

            /*pc-infor-nickname*/
            .pc-infor-social {
                display: flex;
                justify-content: space-between;
                font-size: 16px;
                margin-bottom: 12px;

                .posts {}

                .followers {}

                .friends {}
            }

            /**pc-infor-social */

            .pc-infor-fullname {
                display: flex;
            }

            .pc-infor-about {
                line-height: 1.2em;
                background-origin: content-box;

                /* some extra styles*/
                text-align: left;
                font-family: calibri, arial, sans-serif;
            }
        }

        /* contents */
    }

    .list {
        width: 100%;
        height: fit-content;
        position: relative;
        display: grid;
        grid-template-columns: auto auto auto;
        margin-top: 50px;
        cursor: pointer;

        .hover {
            background-color: black;
            background: rgba(0, 0, 0, 0.5);
            position: absolute;
            width: 324px;
            height: 324px;
            text-align: center;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: white;

            .icon-hover {
                padding: 0 10px 0 20px;
            }

        }

        .listpost {
            flex: 1 0 33%;
            height: 328px;
            position: relative;

            .imgp {
                width: 324px;
                height: 324px;
                object-fit: cover;

            }

            .icon {
                position: absolute;
                right: 15px;
                top: 12px;
                color: white;
                font-size: 20px;
            }


        }
    }

    .footer {
        position: relative;
        margin: auto;
        transform: translateX(75%);
    }

    /* ket thuc pc-infor  */
}
</style>