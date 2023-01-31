const Paging = ({pagination,setParam,setIsLoading}) => {

    let pageNumber =[1];
    if(pagination) {
        pageNumber =Array.from({length:pagination.totalPage},(_,i)=>i+1);
    }
    return (
        <>
          <div className="paging-container">
            <button
              className="move-page-btn"
              disabled={!pagination.hasPrevious}
              onClick={() =>{
                setParam((prev) => ({...prev,PageNumber: prev.PageNumber - 1,}));
                setIsLoading(true);
              }
              }
            >
              Prev
            </button>
            {pageNumber.map((number,index) => (
                <button
                  key={index}
                  style={
                    number === pagination.pageNumber
                      ? { cursor: "pointer", color: "red" }
                      : { cursor: "pointer" }
                  }
                  className="page-number-btn"
                  onClick={() =>{
                    setParam((prev) => ({...prev,PageNumber: number,}));
                    setIsLoading(true);
                  }
                  }
                >
                  {number} 
                </button>
              ))
            }
            <button
              className="move-page-btn"
              disabled={!pagination.hasNext}
              onClick={() =>{
                setParam((prev) => ({...prev,PageNumber: prev.PageNumber + 1,}))
                setIsLoading(true);
              }
              }
            >
              Next
            </button>
          </div>
        </>
      );
}

export default Paging;