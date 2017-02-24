<topbar>
    <ul>
        <li>ありたそ画展</li>
        <li show={ is_alitaso }><a href="post.html">画像投稿</a></li>
        <li id="loggedin" show={ this.isLoggedIn() }>
            <img src={ this.getPhotoURL() }>
        </li>
        <li show={ !this.isLoggedIn() } id="login">
            <span><i class="fa fa-twitter"></i>Login</span>
        </li>
    </ul>

    <script type="typescript">
        declare var opts: any;
        this.is_alitaso = opts.isAlitaso;
        this.user = opts.user;

        this.getPhotoURL = (): string => {
            if (this.user) return this.user.photoURL;
            else return '';
        }

        this.isLoggedIn = (): boolean => {
            if (this.user) return true;
            else return false;
        }
    </script>

    <style>
    topbar {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: auto;
        margin: 0;
        padding: 0;
    }

    topbar ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #333;
    }

    topbar li {
        display: inline-block;
        padding: 20px 16px;
        color: #f2f2f2;
        font-size: 20px;
    }

    topbar li a {
        color: #f2f2f2;
    }
    #loggedin,
    topbar #login {
        padding: 9px 16px;
        float: right;
    }

    #loggedin img,
    topbar #login img {
        width: 40px;
    }

    #loggedin i,
    topbar #login i {
        padding: 10px 5px;
    }

    #loggedin span,
    topbar #login span {
        cursor: pointer;
    }
    </style>
</topbar>
