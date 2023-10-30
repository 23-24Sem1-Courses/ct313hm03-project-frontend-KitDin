<template>
    <div>
        <Header></Header>
        <div class="HomeContent">
            <Nav></Nav>
            <div class="HC-Post">
                <div class="HC-Post-infor">
                    <img :src="loadimg(user)" class="avatar">
                    <p class="HC-Post-username name1">Ruych.im <span class="username-time">• 19h</span></p>
                </div>
                <div class="HC-Post-imgs">
                    <div class="img-container" v-for="(img, index) in imgs" :key="index">
                        <img :src="loadimgpost(img)" class="img">
                    </div>
                    <div style="color: brown; margin-left: 5px;">End</div>
                    <div class="HC-Post-scroll-bar">
                        <div class="HC-Post-scroll-bar-dots">
                            <div class="HC-Post-scroll-bar-dot" v-for="(img, index) in imgs" :key="index"></div>
                        </div>
                    </div>
                </div>
                <div class="HC-Post-icon">
                    <i @click="toggleHeart()"
                        :class="['bi', { 'bi-heart': !isHeartFilled }, 'icon', { 'bi-heart-fill': isHeartFilled }]"></i>
                    <i class="bi bi-chat icon"></i>
                </div>
                <div class="HC-Post-status">
                    <span class="HC-Post-username name2">Ruych.im</span>
                    <span class="status">Hello choi cung nhoa</span>
                    <div class="status-hashtag">
                        <span class="hashtag">#maiyeu</span>
                        <span class="hashtag">#vlog</span>
                        <span class="hashtag">#choicung</span>
                        <span class="hashtag">#vuide</span>
                    </div>
                </div>
                <div class="allcomment">View 16 comment</div>
                <input class="inputcomment" type="text" @pointerenter="" placeholder="Add a comment...">
            </div>
            <NavRequestFriend></NavRequestFriend>
        </div>
    </div>
</template>

<script>
import Footer from "../components/Footer.vue"
import Nav from "../components/Nav.vue"
import NavRequestFriend from "../components/NavRequestFriend.vue"
import AuthenticationService from "../services/AuthenticationService"

const handleScroll = (event) => {
    const scrollPercent = event.target.scrollLeft / (imgs.length - 1);
    const currentDot = Math.floor(scrollPercent * 3);

    const dots = document.querySelectorAll(".HC-Post-scroll-bar-dot");
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    dots[currentDot].classList.add("active");
};

export default {
    name: 'Home',
    data() {
        return {
            currentImageIndex: 0,
            isHeartFilled: false,
            userid: this.$router.history.current.params.id,
            user: [],
            imgs: [
                "user8.png",
                "user1.png",
                "user4.png",
                "user5.png",
                "user6.png",
            ]
        }
    },
    components: {
        Footer,
        Nav,
        NavRequestFriend
    },
    props: ['id'],
    methods: {
        handleScroll,
        loadimgpost(img) {
            return require(`../../../server/public/uploads/avatar/${img}`);
        },
        toggleHeart() {
            this.isHeartFilled = !this.isHeartFilled; // Chuyển đổi trạng thái trái tim
            console.log(this.isHeartFilled)
        }, loadimg(user) {
            if (user && user.USER_AvatarURL) {
                return require(`../../../server/public/uploads/avatar/${user.USER_AvatarURL}`);
            }
        }
    },
    async mounted() {
        this.user = (await AuthenticationService.getUser(this.userid)).data
        console.log(this.id);
    }
}
</script>

<style scoped>
.HomeContent {
    top: 0;
    margin: 0;
    width: 100%;
    height: fit-content;
    position: absolute;

    .HC-Post {
        width: 478px;
        height: fit-content;
        margin: 0px 462px 0px 400px;
        padding-top: 28px;
        border-bottom: #737373 solid 0.5px;

        .HC-Post-infor {
            width: 100%;
            display: flex;
            margin: 0 12px 12px 8px;

            .avatar {
                width: 42px;
                height: 42px;
                object-fit: cover;
                border-radius: 50%;
            }

            .HC-Post-username {
                margin: 0;
                font-size: 14px;
                text-align: center;
                position: relative;
                top: 50%;
                transform: translate(10px, 10px);
                font-weight: 600;
                cursor: pointer;

                .username-time {
                    font-weight: 500;
                    color: #737373;
                }
            }
        }




        .HC-Post-icon {
            padding-top: 8px;

            .icon {
                font-size: 24px;
                padding: 8px;

                &:hover {
                    opacity: .5;
                }
            }

            .bi-heart-fill {
                color: violet;
            }

        }

        .HC-Post-like {
            font-size: 14px;
            font-weight: 500px;
            margin-bottom: 8px;
        }

        .HC-Post-status {
            font-size: 14px;
            margin-bottom: 8px;

            .HC-Post-username {
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
            }

            .status {}

            .status-hashtag {
                .hashtag {
                    color: #00376b;
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
        }

        .allcomment {
            font-size: 14px;
            color: #737373;
            cursor: pointer;
            margin-bottom: 8px;
        }

        .inputcomment {
            width: 100%;
            border: none;
            /* background-color: #fafafa; */
            font-size: 14px;
            margin-bottom: 8px;
        }
    }
}

.HC-Post-imgs::-webkit-scrollbar {
    display: none;
}

.HC-Post-imgs {
    width: 469px;
    height: 589px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* position: relative; */

}

.HC-Post-imgs .img-container {
    scroll-snap-align: center;
}

.HC-Post-imgs .img-container .img {
    width: 469px;
    height: 589px;
    object-fit: cover;
}

.HC-Post-scroll-bar {
    width: 469px;
    height: 30px;
    border-radius: 15px;
    /* background-color: #ccc */
    bottom: 150px;
    position: absolute;
}

.HC-Post-scroll-bar-dots {
    display: flex;
    align-items: center;
    justify-content: center;
}

.HC-Post-scroll-bar-dot {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #ccc;
    margin: 0 5px;
}
</style>


