<template>
    <div class="NavFriend">
        <div class="NF-myInf">
            <img class="NF-myInf-avatar pointer" @click="goProfilePersonal" :src="loadimg(user_personal)" alt="">
            <div class="NF-myInf-name">
                <p class="myUsername pointer" @click="goProfilePersonal">{{ user_personal.USER_NickName }}</p>
                <p class="myName">{{ user_personal.USER_SubName + " " + user_personal.USER_FirstName }}</p>
            </div>
            <p class="NF-myInf-logout" @click="logout()">Logout</p>
        </div>
        <div class="NF-line">Your request </div>

        <!-- test -->

        <div class="NF-request" v-for="user in users.slice(0, 5)" :key="user.id">
            <div class="NF-request-user">
                <img class="NF-request-user-avata pointer" @click="goProfileOther(user)" :src="loadimg(user)" alt="">
                <div class="NF-request-user-name">
                    <p class="username pointer" @click="goProfileOther(user)"> {{ user.USER_NickName }}</p>
                    <p class="time">by {{ timeRequest(user) }}</p>
                </div>
                <button class="NF-request-user-accept" @click="clickaccept(user)">Accept</button>
            </div>
        </div>
        <div class="loader" v-if="loadingAccept">
            <div class="rectangles">
                <div class="rect"></div>
                <div class="rect"></div>
                <div class="rect"></div>
            </div>
        </div>
        <!-- <div class="succ">successful</div> -->
        <router-view />
        <Footer class="footer"></Footer>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import Footer from './Footer.vue';
import AuthenticationService from '../services/AuthenticationService';


export default {
    data() {
        return {
            loadingAccept: false,
            user_personal: [],
            userid: this.$router.history.current.params.id,
            users: []
        }
    },
    components: {
        RouterLink,
        Footer
    }, methods: {
        logout() {
            this.$router.push('/')
        },
        loadimg(user) {
            if (user && user.USER_AvatarURL) {
                return require(`../../../server/public/uploads/avatar/${user.USER_AvatarURL}`);
            }
        }
        , timeRequest(user) {
            const fixedDate = new Date(user.FR_CreateAt);
            const currentDate = new Date();
            const timeDifference = currentDate - fixedDate;
            const seconds = Math.floor(timeDifference / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (seconds > 0 && seconds <= 60) {
                return seconds + " s"
            } else if (minutes > 0 && minutes <= 60) {
                return minutes + " minutes"
            } else if (hours > 0 && hours <= 24) {
                return hours + " hours"
            } else if (days > 0) {
                return days + " days"
            }
        }, async clickaccept(user) {
            this.loadingAccept = true;

            const add = await AuthenticationService.addAFrient(this.userid, {
                idRequest: user.FR_id,
            });

            if (add) {

                setTimeout(async () => {
                    this.users = (await AuthenticationService.getUserRequest(this.userid)).data;
                    this.loadingAccept = false;
                }, 500);
            }
        },
        goProfilePersonal() {
            this.$router.push(`/profile/${this.userid}`)
        },
        goProfileOther(idother) {
            this.$router.push(`/profile/${this.userid}/${idother.USER_Id}`)
        }
    }, async mounted() {
        this.user_personal = (await AuthenticationService.getUser(this.userid)).data;
        this.users = (await AuthenticationService.getUserRequest(this.userid)).data;
    }
}
</script>
<style scoped>
.NavFriend {
    position: absolute;
    right: 52px;
    top: 52px;
    width: 360px;
    height: fit-content;

    .footer {
        padding-top: 22px;
        opacity: .5;
    }

    .NF-myInf {
        width: 100%;
        display: flex;
        position: relative;

        .NF-myInf-avatar {
            height: 56px;
            width: 56px;
            object-fit: cover;
            border-radius: 50%;
            margin-right: 20px;
        }

        .NF-myInf-name {
            font-size: 14px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            flex-wrap: nowrap;

            .myUsername {
                margin: 0;
                font-weight: 600;
            }

            .myName {
                margin: 0;
                color: #737373;
                opacity: .7;
            }
        }

        .NF-myInf-logout {
            font-size: 14px;
            cursor: pointer;
            text-decoration: none;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translate(-50%, -50%);
            color: #0095f6;
            font-weight: bolder;
        }
    }

    .NF-line {
        padding: 12px 0 12px 0px;
        font-size: 14px;
        font-weight: 600;
        color: #737373;
    }

    .NF-request {
        display: flex;
        width: 100%;
        height: 50px;
        padding: 6px 0 6px 0px;
        position: relative;

        .NF-request-user {
            display: flex;

            .NF-request-user-avata {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: cover;
                margin-right: 20px;
            }

            .NF-request-user-name {
                font-size: 14px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                flex-wrap: nowrap;

                .username {
                    margin: 0;
                    font-weight: 600;
                }

                .time {
                    font-size: 12px;
                    margin: 0;
                    color: #737373;
                    opacity: .7;
                }
            }

        }

        .NF-request-user-accept {
            position: absolute;
            right: 0;
            border: none;
            top: 50%;
            /* background-color: #fafafa; */
            background-color: white;
            right: 0;
            top: 50%;
            transform: translate(-50%, -50%);
            color: #0095f6;
            font-size: 14px;
            font-weight: 400;

        }

    }
}


.loader {
    width: 24px;
    height: 24px;
    position: absolute;
    top: 80px;
    right: 36px;
    transform: translateY(-50%);
}

.rectangles {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: spin 1s linear infinite;
}

.rect {
    width: 12px;
    height: 4px;
    background: #3498db;
    border-radius: 2px;
    margin: 1px 0;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.pointer {
    cursor: pointer;
}
</style>