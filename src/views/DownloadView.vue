<template>
    <div class="bg">
        <div class="main">
            <div>
                <img src="../../public/banner.png" style="height: 180px;">
                <div class="btn-group" style="margin-top: 100px;margin-left: 400px;">
                    <a class="download-btn" href="/package/net-thunder-win.zip">
                        <div>Windows下载</div>
                    </a>
                    <a class="download-btn" href="/package/net-thunder-osx.zip">
                        <div>MacOS下载</div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    mounted() {
    }
}
</script>
<style>
.bg {
    background-image: url("../../public/download-bg.png");
    width: 100%;
    height: 100%;
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