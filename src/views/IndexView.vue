<template>
    <div class="bg">
        <div class="layer1 flex direction-row-reverse">
            <div class="btn-group" style="margin-top: 20px;margin-right: 20px;">
                <a class="manage-btn" href="/#/account">
                    <div>后端管理</div>
                </a>
            </div>
        </div>
        <div class="layer2">
            <div class="main">
                <div>
                    <img src="../../public/banner.png" style="height: 180px;">
                    <div class="btn-group" style="margin-top: 100px;margin-left: 400px;">
                        <a class="download-btn" v-if="null != data.windows" :href="`/api/storage/${data.windows}`">
                            <div>Windows 下载</div>
                        </a>
                        <a class="download-btn" v-else>
                            <div>Windows 敬请期待</div>
                        </a>
                        <a class="download-btn" v-if="null != data.osx" :href="`/api/storage/${data.osx}`">
                            <div>MacOS 下载</div>
                        </a>
                        <a class="download-btn" v-else>
                            <div>MacOS 敬请期待</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import http from '../api';
export default {
    data() {
        return {
            data: {}
        }
    },
    async mounted() {
        let { status, data } = await http.get(`/api/appVersion/lastVersion`)
        this.data = data
    }
}
</script>
<style>
.bg {
    background-image: url("../../public/download-bg.png");
    width: 100%;
    height: 100%;
}

.layer1 {}

.layer2 {
    margin-top: 15%;
    display: flex;
    align-items: center;
}

.main {
    width: 100%;
    display: flex;
    justify-content: center;
}

.btn-group {
    margin-left: 150px;
    display: flex;
}

.manage-btn {
    background-color: rgb(63, 105, 246);
    color: rgb(255, 255, 255);
    width: 100px;
    height: 40px;
    line-height: 40px;
    border-radius: 40px;
    text-align: center;
    text-decoration: none;
}

.download-btn {
    background-color: rgb(63, 105, 246);
    color: rgb(255, 255, 255);
    width: 180px;
    height: 60px;
    line-height: 60px;
    border-radius: 60px;
    font-size: 16px;
    font-weight: bolder;
    text-align: center;
    margin: 0px 20px;
    text-decoration: none;
}
</style>