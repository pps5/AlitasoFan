<topbar>
    <ul class="nav">
        <li>ありたそ画展</li>
        <li show={ is_alitaso }><a href="post.html">画像投稿</a></li>
        <li id="loggedin" show={ this.isLoggedIn() }>
            <img src={ this.getPhotoURL() } onclick={ toggle }>
        </li>
        <li show={ !this.isLoggedIn() } id="login">
            <span><i class="fa fa-twitter"></i>Login</span>
        </li>
    </ul>
    <ul show={ dropdown } class="dropdown-content">
        <li>{ this.getDisplayName() }</li>
        <li class="logout" onclick={ logout }>Logout</li>
    </ul>

    <script type="typescript">
        declare var opts: any;
        this.is_alitaso = opts.isAlitaso;
        this.user = opts.user;
        this.dropdown = false;

        document.addEventListener('click', (event) => {
            if (this.dropdown) {
                this.dropdown = false;
                this.update();
            }
        });

        document.addEventListener('onAuthStateChanged', (event: any) => {
            this.user = event.detail.user;
            if (event.detail.isAlitaso) {
                this.is_alitaso = true;
            } else {
                this.is_alitaso = false;
            }
            this.update();
        });

        this.getPhotoURL = (): string => {
            if (this.user) return this.user.photoURL;
            else return '';
        }

        this.getDisplayName = (): string => {
            if (this.user) return this.user.displayName;
            else return '';
        }

        this.toggle = (event) => {
            this.dropdown = !this.dropdown;
            event.stopPropagation();
        }

        this.isLoggedIn = (): boolean => {
            if (this.user) return true;
            else return false;
        }

        this.logout = (event): void => {
            console.log(event);
            document.dispatchEvent(new CustomEvent('logoutRequest'));
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

    .nav {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #333;
    }

    .nav li {
        display: inline-block;
        padding: 20px 16px;
        color: #f2f2f2;
        font-size: 20px;
    }

    .nav li a {
        color: #f2f2f2;
    }

    #login, #loggedin {
        cursor: pointer;
        padding: 9px 16px;
        float: right;
    }

    #loggedin img {
        width: 40px;
    }

    #login i {
        padding: 10px 5px;
    }

    .dropdown-content {
        position: fixed;
        top: 55px;
        right: 10px;
        margin: 0;
        padding: 10px 30px;
        background-color: #f9f9f9;
        border-radius: 4px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index:1;
        list-style-type: none;
    }

    .dropdown-content li {
        padding: 10px;
    }

    .dropdown-content .logout:hover {
        background-color: #eee;
    }
    .dropdown-content .logout {
        cursor: pointer;
    }
    </style>
</topbar>
