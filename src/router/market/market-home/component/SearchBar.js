import axios from "axios";

function MarketSearchBar({state, setMarketPreviewList}) {

    const goToSearch = async() => {
        const type = document.getElementById("type");
        const keyword = document.getElementById("keyword");
        await axios.get("/market/search", {
            params: {
                
            }
        }).then((response)=>{
            const { status } = response;
            if ( 200 <= status && status < 300) {
                const { data } = response;
                setMarketPreviewList(data);
            }
        })
    }
    return(
        <div>
            <form onSubmit={goToSearch}>
                <select id="type">
                    <option value="전체">전체</option>
                    <option value="제목">제목</option>
                    <option value="내용">내용</option>
                    <option value="카테고리">카테고리</option>
                </select>
                <input id="keyword" type="text" placeholder="검색어를 입력해주세요."/>
                <button>검색</button>
            </form>
        </div>
    );
};

export default MarketSearchBar;