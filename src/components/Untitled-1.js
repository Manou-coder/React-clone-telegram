<div classNameName="d-none d-lg-flex flex-column col-lg-4 p-0 sidebar vh-100 border-end border-secondary _sidebar">
<div className="row w-100 align-items-center sticky-top m-0 bg-white" style="height: 58px;">
    <div className="col-2 d-flex justify-content-center ">
        <span><i className="fa-solid fa-bars fa-lg"></i></span>
    </div>
    <div className="col d-flex justify-content-center">
        <div className="row w-100 bg-white border border-secondary rounded-5 my-2 py-2 align-items-center">
            <div className="col-1">
                <span><i className="fa-solid fa-magnifying-glass fa-lg"></i></span>
            </div>
            <div className="col">
                <input style="border: none; outline: none; width: 200px;" type="text"
                    placeholder="Search"></input>
            </div>
        </div>
    </div>
</div>
{/* <!-- MENU SLIDE --> */}
<div className="row text-center py-3 w-100">
    <div className="col">
        <span className="fw-bold text-primary">All chats</span>
        <div className="row bg-primary py-1 w-75 mt-1 rounded" style="margin: auto;"></div>
    </div>
    <div className="col">
        <span className="fw-bold">Calls</span>
    </div>
</div>
{/* <!-- second party of sidebar --> */}
<div className="container-fluid bg-light"
    style="height: calc(100vh); overflow-y: scroll; scrollbar-width: none; width: 100%;">
    {/* <!-- CONTACT --> */}
    <div className="container-fluid p-0">
        <ul className="p-0" style="listStyleType: none;">
            <li className="w-100 py-1 my-2 rounded">
                <div className="row m-0 align-items-center">
                    <div className="col-2">
                        <img style="height: 50px; width: 50px;"
                            src="https://picsum.photos/50/50?random=1" className="rounded-circle" alt="..."></img>
                    </div>
                    <div className="col">
                        <div>
                            <h3 className="mb-0 fs-5 lh-1">Nao France</h3>
                        </div>
                        <div>
                            <p className="mb-0 fw-light pt-0 lh-1">last seen</p>
                        </div>
                    </div>
                    <div className="col-2 p-0">
                        <span className="badge bg-primary rounded-pill">14</span>
                    </div>
                </div>
            </li>
            <li className="w-100 py-1 my-2 rounded">
                <div className="row m-0 align-items-center">
                    <div className="col-2">
                        <img style="height: 50px; width: 50px;"
                            src="https://picsum.photos/50/50/?random=2" className="rounded-circle"
                            alt="..."></img>
                    </div>
                    <div className="col">
                        <div>
                            <h3 className="mb-0 fs-5 lh-1">Manou</h3>
                        </div>
                        <div>
                            <p className="mb-0 fw-light pt-0 lh-1">last seen</p>
                        </div>
                    </div>
                    <div className="col-2 p-0">
                        <span className="badge bg-primary rounded-pill">3</span>
                    </div>
                </div>
            </li>
            <li className="w-100 py-1 my-2 rounded" id="cloneDiv">
                <div className="row m-0 align-items-center">
                    <div className="col-2">
                        <img style="height: 50px; width: 50px;"
                            src="https://picsum.photos/50/50?random=3" className="rounded-circle" alt="..."></img>
                    </div>
                    <div className="col">
                        <div>
                            <h3 className="mb-0 fs-5 lh-1">Binyamin</h3>
                        </div>
                        <div>
                            <p className="mb-0 fw-light pt-0 lh-1">last seen</p>
                        </div>
                    </div>
                    <div className="col-2 p-0">
                        <span className="badge bg-primary rounded-pill">8</span>
                    </div>
                </div>
            </li>
            {/* <!-- clone la div binyamin -->
            <script>
                var id = "cloneDiv"; // ID de ton div a cloner
                var copy = 30; // Nombre de copie à faire

                var elem = document.getElementById(id);
                for (var i = 0; i < copy; i++) {
                    elem.parentNode.appendChild(elem.cloneNode(true));
                }
            </script> */}
        </ul>
    </div>
</div>
</div>