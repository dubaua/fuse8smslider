Vue.component("post", {
  props: ["content", "onMount"],
  template: `                            
<div class="post">
    <div class="postHeader">
        <div class="userpic">
            <img :src="content.userpic" :alt="content.username">
        </div>
        <div class="username">{{content.username}}</div>
        <div class="socialMediaIcon">
            <img :src="content.socialMediaIcon">
        </div>
    </div>
    <div class="photo">
        <img :src="content.photoUrl">
    </div>
    <div class="content">{{content.content}}</div>
</div>`,
  data: function() {
    return {};
  },
  mounted: function() {
    this.$nextTick(function() {
      this.onMount();
    });
  }
});

var app = new Vue({
  el: "#app",
  data: {
    isReady: false,
    posts: [],
    postsSwiper: {},
    isPostsSwiperReady: false,
    backgrounds: [
      {
        src: "img/background-1.jpg",
        color: "black"
      },
      {
        src: "img/background-2.jpg",
        color: "black"
      },
      {
        src: "img/background-3.jpg",
        color: "white"
      },
      {
        src: "img/background-4.jpg",
        color: "white"
      },
      {
        src: "img/background-5.jpg",
        color: "#d1ddcf"
      },
      {
        src: "img/background-6.jpg",
        color: "black"
      }
    ],
    currentBackground: 0,
    backgroundSwiper: {}
  },
  mounted: function() {
    this.$nextTick(function() {
      const self = this;
      self.fetchData("data.json");
      // emulate next fetch
      setTimeout(() => {
        self.fetchData("next1.json");
        setTimeout(() => {
          self.fetchData("next2.json");
        }, 3000);
      }, 3000);
      self.backgroundSwiper = new Swiper(".js-background-swiper", {
        speed: 1000,
        effect: "fade",
        fadeEffect: {
          crossFade: true
        },
        on: {
          init: function() {
            self.runAutoplay();
          }
        }
      });
    });
  },
  methods: {
    runAutoplay: function() {
      const self = this;
      setInterval(() => {
        self.currentBackground =
          (self.currentBackground + 1) % self.backgrounds.length;
        self.backgroundSwiper.slideTo(self.currentBackground);
      }, 5e3);
    },

    initPosts: function() {
      const self = this;
      self.postsSwiper = new Swiper(".js-posts-swiper", {
        speed: 333,
        spaceBetween: 32,
        slidesPerView: 3,
        on: {
          init: function() {
            self.isPostsSwiperReady = true;
          }
        }
      });
    },

    updatePosts: function() {
      const self = this;
      if (self.isPostsSwiperReady) {
        self.postsSwiper.update();
        self.postsSwiper.slideTo(self.posts.length - 1);
      }
    },

    fetchData: function(url) {
      const self = this;
      axios
        .get(url)
        .then(function(response) {
          if (self.isReady) {
            self.posts = self.posts.concat(response.data);
          } else {
            self.posts = response.data;
            self.isReady = true;
          }
        })
        .catch(function(error) {});
    }
  },
  computed: {
    currentColor: function() {
      return this.backgrounds[this.currentBackground].color;
    }
  }
});
