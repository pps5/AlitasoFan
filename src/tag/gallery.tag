<gallery>
  <select id="order" onchange={ onChanged }>
    <option value="newer">新しい順</option>
    <option value="older">古い順</option>
    <option value="like">いいね順</option>
  </select>

  <div id="lg-container">
  <div each={ item in items } class="flex-item">
    <figure id={ item.key }
     class="pic-wrapper" data-sub-html="#lg-caption{ item.key }"
     data-src="{ this.getURL(item.key) }"
     data-tweet-text="{ this.getTweetText(item.character) }">

      <img class="picture" src="{ this.getURL(item.key) }">

      <figcaption class="label">
        <p>{ item.character }</p>
        <p>{ this.getDateString(item.timestamp) }</p>
      </figcaption>

      <div id="lg-caption{ item.key }" class="lg-caption">
        <h3>
          { item.character }（{ item.original }）<br>
          { this.getDateString(item.timestamp) }
        </h3>

      </div>
      <i class="{ this.getLikeClass(item.like.users) }" onclick={ like }></i>
      <i class="fa fa-twitter" onclick={ share }></i>
      <span class="like-count">{ item.like.count } liked</span>
    </figure>
  </div>

    <script type="typescript">
    declare var opts: any;

    this.BASE_PIC_URL = 'https://firebasestorage.googleapis.com/v0/b/alitasofan.appspot.com/o/images%2F';
    this.URL_SELF = 'https://pps5.github.io/AlitasoFan/';
    this.URL_TWEET = 'https://twitter.com/intent/tweet?text=';

    document.addEventListener('onAuthStateChanged', (event: any) => {
      this.user = event.detail.user;
      this.update();
    });

    document.addEventListener('onGalleryItemsChanged', (event: any) => {
      this.items = event.detail.items;
    })

    this.getOrgOrder = (data: Array<any>): Array<any> => {
      var orgOrder = [];

      for (let item of data) {
        orgOrder.push(item.key);
      }
      return orgOrder;
    }

    this.getDateString = (timestamp: number): string => {
      var date = new Date(timestamp);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      return year + '年' + month + '月' + day + '日';
    }

    this.getURL = (key: string): string => {
      return this.BASE_PIC_URL + key + '?alt=media';
    }

    this.getTweetText = (character: string): string => {
      return encodeURIComponent(character + ' #ありたそ画展');
    }

    this.getLikeClass = (likeUsers: { [index: string]: string}): string => {
      if (this.user && likeUsers && likeUsers[this.user.uid]) {
        return 'fa fa-heart';
      } else {
        return 'fa fa-heart-o';
      }
    }

    this.share = (event) => {
      event.preventDefault();
      var item = event.item.item;
      var tweetURL = encodeURIComponent(this.URL_SELF + '#lg=1&slide=');
      var slidenum = this.orgOrder.indexOf(this.orgOrder.find((elem, idx, array) => {
        return elem === item.key;
      }));
      var text = this.getTweetText(item.character);
      window.open(this.URL_TWEET + text + '&url=' + tweetURL + slidenum);
      event.stopPropagation();
    }

    this.like = (event) => {
      var like = event.item.item.like;
      if (this.user) {
        document.dispatchEvent(new CustomEvent('toggleLikeRequest', {
          detail: { item: event.item.item }
        }));
      } else {
        document.dispatchEvent(new CustomEvent('loginRequest', {
          detail: { item: event.item.item }
        }));
      }
      event.stopPropagation();
    }

    this.onChanged = (event) => {
      var value = event.target.value;
      if (value === 'newer') {
        this.sort('timestamp', false);
      } else if (value === 'older') {
        this.sort('timestamp', true);
      } else if (value === 'like') {
        this.sort('timestamp', false);
        this.sort('like', false);
      }
    }

    this.sort = (key: string, isAsc: boolean): void => {
      if (isAsc) {
        var num_a = 1;
        var num_b = -1;
      } else {
        var num_a = -1;
        var num_b = 1;
      }

      this.items.sort((a: any, b: any) => {
        var x, y;
        if (key === 'like') {
          x = a[key]['count'];
          y = b[key]['count'];
        } else {
          x = a[key];
          y = b[key];
        }
        if (x > y) return num_a;
        if (x < y) return num_b;
        return 0;
      });
    }

    this.user = opts.user;
    this.orgOrder = this.getOrgOrder(opts.items);
    this.items = opts.items;
    </script>

</gallery>