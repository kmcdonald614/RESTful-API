  
<script>
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import { defineComponent } from 'vue';
import '@splidejs/vue-splide/css';

export default defineComponent({
    data() {
        return {
            logo: {
                element_1: {
                    img: "../../images/2021-15.jpg", 
                    description: "Description of the framework like what id does and \
                                how we used it in this project...", 
                    assetName: "Name of Framework"
                }, 
                element_2: {
                    img: "../../images/4Q7A9358.jpg", 
                    description: "some different description", 
                    assetName: "Name of Framework 2"
                }, 
                element_3: {
                    img: "../../images/police-badge.png", 
                    description: "some other description", 
                    assetName: "Name of Framework 3"
                }
            }
        }
    },
    components: { Splide, SplideSlide },
});


Splide.defaults = {
    rewind: true,
    rewindSpeed: 1000,
    width: '100%',
    height: '10%'
}
</script>

<template>
    <div class="grid-x">
        <div class="large-12 medium-12 small-12 cell">
            User profiles will go here -- try to use some hoverable note cards
        </div>
    </div>
    <div class="grid-x">
        <div class="large-12 medium-12 small-12 cell">
            Video link will go here -- this will be an centered iframe from the video uploaded to youtube
        </div>
    </div>
    <div class="grid-x">
        <div class="large-12 medium-12 small-12 cell">
            Observations will go here -- organized by each Observations
        </div>
    </div>
    <div class="grid-x">
        <div class="large-12 medium-12 small-12 cell">
            <Splide :options="{ rewind: true, drag: 'free' }" aria-label="Vue Splide Example">
                <SplideSlide v-for="element in logo">
                    <div class="grid-x">
                        <div class="image large-1 medium-1 small-1 cell"></div>
                        <div class="image large-5 medium-5 small-5 cell">
                            <img class="logo" :src=element.img alt="">
                        </div>
                        <div class="desc large-5 medium-5 small-5 cell">
                            <div class="logo_header">
                                <p>{{element.assetName}}</p>
                            </div>
                            <p>{{element.description}}</p>
                        </div>
                        <div class="image large-1 medium-1 small-1 cell"></div>
                    </div>
                </SplideSlide>
            </Splide>
        </div>
    </div>

</template>

<style>
.logo {
    width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo_header {
    font-size: 1.3rem;
    text-decoration: underline;
    text-align: center;
}

.desc {
    height: 300px;
    padding: 1rem;
    background-color: rgba(200, 200, 200, 0.8);
}

.image {
    text-align: right;
}
</style>