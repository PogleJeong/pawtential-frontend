import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { MARKET } from "../../../constants/UrlPath";

const Wrapper = styled.div`
    padding: 100px 30px;
    border-left: 1px solid rgba(0,0,0,0.1);
    border-right: 1px solid rgba(0,0,0,0.1);
    border-bottom: 1px solid rgba(0,0,0,0.1);
    box-shadow: 3px 0 5px rgba(0, 0, 0, 0.1); 
    height: 800px;
`

const Main = styled.div`
    width: 200px;
    justify-content: center;
    h2 {
        text-align: center;
        font-size: 1.75rem;
        font-weight: bold;
        margin: 10px 0px;
    }
    .market_status {
        ul {
            display: flex;
            justify-content: center;
            align-items: center;
            li {
                margin: 10px 10px;
                font-weight: bold;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
`

const SearchBox = styled.div`
    margin-top: 50px;
`

const SearchForm = styled.form`
    div {
        margin-bottom: 15px;
    }
    p {
        margin-bottom: 10px;
        font-weight: bold;
    }
    input {
        width: 100%;
        border-radius: 3px;
        height: 30px;
    }

    button {
        display: inline-block;
        width: 100%;
        padding: 10px 20px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
        background-color: #3498db;
        color: #fff;

        &:hover {
            background-color: #2980b9;
        }
    }
`

const ErrorMessage = styled.small`
    color: red;
`

const typeList = ["all", "free", "sell"] ;
function MarketSideBar({filter}) {

    const navigator = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm({
        defaultValues: {
            type: "",
            keyword: ""
        },
        mode: "onSubmit"
    });

    useEffect(()=>{
        console.log(errors);
        if (errors?.type) {
            alert("검색기준을 선택헤주세요");
        }
        if (errors?.keyword) {
            alert("검색어를 입력해주세요");
        }
    }, [errors]);

    const goToSearch = async(data) => {
        const { type, keyword } = data;
       
        // form 초기화
        setValue("type", "선택");
        setValue("keyword", "");
        
        // 페이지 이동
        navigator(`${MARKET}?type=${type}&keyword=${keyword}&page=1`);
    }

    return(
        <Wrapper>
            <Main>
                <h2>마켓 플레이스</h2>
                <hr/>
                <section className="market_status">
                    <ul>
                    {typeList.map((type)=>(
                        <li key={type}><Link to={`?filter=${type}&page=1`} 
                        style={{color: filter === type && "blue"}}>
                        {type.toUpperCase()}</Link></li>
                    ))}
                    </ul>
                </section>
                <SearchBox>
                    <SearchForm onSubmit={handleSubmit(goToSearch)}>
                        <div>
                            <p>검색기준</p>
                            <select {...register("type", {
                                validate: {
                                    type: (value) => typeList.includes(value) || "선택해주세요",
                                    check: (value) => value !== "" || "기준을 설정해주세요",
                                },
                                defaultValues: "선택"
                            })}>
                                <option value="">=select=</option>
                            {typeList.map((type, index)=>
                                <option key={index} value={type}>{type}</option>)}
                            </select><br/>
                            
                        </div>
                        <div>
                            <p>검색어</p>
                            <input type="text"
                                {...register("keyword", {
                                    required: "검색어를 입력해주세요"
                                })}
                            />
                        </div>
                        <div>
                            <button type="submit">검색</button>
                        </div>
                    </SearchForm>
                </SearchBox>
            </Main>
        </Wrapper>
    );
};

export default MarketSideBar;