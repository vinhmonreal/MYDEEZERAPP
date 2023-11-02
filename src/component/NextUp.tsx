
export default function NextUp() {
    return (
        <div id="nextup">
            <div className="nextup-heading">
                <h2>Next Up</h2>
                <a href="">Open Queue</a>

            </div>
            <div className="nextup__track">
                <div className="nextup__track__img">
                    <img id="nextup__track__img" alt="" />
                </div>
                <div className="nextup__track__details">
                    <h4 id="nextup__track__title"></h4>
                    <a id="nextup__track__artist" ></a>
                </div>
            </div>
        </div>
    )
}