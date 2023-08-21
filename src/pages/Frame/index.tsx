import { Divider, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import CommonNav from "../../components/CommonNav";
import Layout from "../../components/Layout";

import MiniHeader from "../../components/MiniHeader";
import right from "../../assests/Images/blueright.png";
// import right2 from "../../assests/Images/blueright2.png";
import three from "../../assests/Images/three.png";
import carve from "../../assests/Images/carve.png";
import updown from "../../assests/Images/updown.png";
import x from "../../assests/Images/Xclam.svg";
import flag2 from "../../assests/Images/flag2.svg";

import "../../font.css/index.css"

import Footer from "../../components/AppFooter";
import { useStyles } from "../../Styles";
import flag from "../../assests/Images/americanflag.png";
import female from "../../assests/Images/female.png";
import walet from "../../assests/Images/walet.png";
import sett from "../../assests/Images/sett.png";
import wallet from "../../assests/Images/headwallet.png";
import notification from "../../assests/Images/notification.png";
import user from "../../assests/Images/User.png";

import meta from "../../assests/Images/metaicon.svg";
import Bicon from "../../assests/Images/bitcoinicon.png";
import right2 from "../../assests/Images/gray4.png";

import running from "../../assests/Images/running.png";
import priceimg2 from "../../assests/Images/arrow.png";
import priceimg1 from "../../assests/Images/btnB.png";
import { Box } from "@mui/system";
import TabHeader from "../../components/TabHeader";
import AppButton from "../../components/AppButton";


import { Link, useParams, useNavigate } from 'react-router-dom';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { useMemo } from 'react';
import { DEFAULT_NETWORK } from "../../constants/chains";
import { curTokenAddress, tokenNetwork } from "../Throughtpayment/constant";
import useUSDPirce from '../../hooks/usePrice';
import useTransferFee from '../../hooks/useTransferFee';
import useSendTokens from "../../hooks/useSendTokens";
import useTokenPrice from "../../hooks/useTokenPrice";
import { sendToken } from '../../contract/index';
import { getshortWalletAddress } from "../../utils";
import Tabh from "../../components/TabhCard";
import { useAlertProvider } from "../../Context/alert_context";
import { AnyARecord } from "dns";


const ReviewandDetail = () => {
  const classes = useStyles();
  const {chainId} = useActiveWeb3React();
  const {token,amount} = useParams();
  const tokenName = token==="any" || !token?"":token;  
  const TokenAmount = amount?parseFloat(amount):0;
  const {alertArray,setAlertList} = useAlertProvider();
  const navigate = useNavigate()
  const network = useMemo(()=>{
    if(!chainId) return "";
    if(tokenName==="") return "";
    const chain = DEFAULT_NETWORK || chainId;
    return tokenNetwork(tokenName,chain);
  },[chainId,token]);

  const usdPrice = useUSDPirce(TokenAmount,tokenName);
  const TokenUsdPrice = useTokenPrice(tokenName);
  const transFeeByToken = useTransferFee(TokenAmount,tokenName); //tranfer fee with tokenVal 
  const curAdddress  = curTokenAddress(tokenName,chainId!);
  const {account} = useActiveWeb3React();
  const shortName = useMemo(()=>{
    if(account){
        return  getshortWalletAddress(account);
    }else{
        return "0x................"      
    }
  },[account])
  const SendToken = useSendTokens(TokenAmount,tokenName,transFeeByToken,curAdddress);
  const handleSendToken = ()=>{
   SendToken().then((hash:string)=>{
      if(hash !==""){
        addAlert(account,hash,alertArray,setAlertList);
        navigate("/paymentdone/"+tokenName+"/"+TokenAmount)
      }
    })
  }
  const addAlert = (_account:string | null | undefined,hash:string,_alertList:Array<string>, _setAlert:any)=>{
      if(_account){
          if(_alertList.length){
            if(_alertList.findIndex((item:string)=>{return hash===item})===-1){
              const accountAlert= [hash,..._alertList];
              console.log("accountAlert:",accountAlert)
              _setAlert(accountAlert);
            }
          }else{
            _setAlert([hash])
          }
      }
  }
  const transFeePercent = useMemo(()=>{
   if(TokenAmount !==0 && transFeeByToken !==0){
      console.log("transfee",transFeeByToken,"tokenAmount",TokenAmount)
      return ((transFeeByToken*100)/(TokenAmount)).toFixed(2);
   }else{
      return 0;
   } 
  },[transFeeByToken,TokenAmount])

  const transFeeUsd = useMemo(()=>{
      return transFeeByToken*TokenUsdPrice;
  },[transFeeByToken,TokenUsdPrice]);
  return (
    <>
      <Layout>
        {/* <Box>
        <CommonNav login2="Login" Signup2="Signup" priceimg1={priceimg1} priceimg2={priceimg2} img3={sett} img1={wallet} img4={user} img2={notification} name="100$" />
      </Box> */}
        <Box sx={{ transform: { lg: "scale(0.9)", xs: "scale(none)" }, }}>
          <MiniHeader />
        </Box>

        <Grid container>
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              backgroundColor: "#F7FDFF",
              display: "flex",
              justifyContent: "center",
              borderTop: "1px solid  #D1D5DB",
              borderBottom: "1px solid  #D1D5DB",
            }}
          >
            <Grid
              item
              md={10.2}
              xs={12}
              sx={{
                marginBottom: { lg: "-4px", xs: "0px" },
                transform: { lg: "scale(0.9)", xs: "scale(none)" },
                borderRight: "1px solid  #D1D5DB",
                borderLeft: "1px solid  #D1D5DB",
                display: "flex",
                flexDirection: { md: "row", sm: "row", xs: "column" },
              }}
            >
              <Grid md={3} sx={{ display: { md: "flex", xs: "none" } }}>
                <Tabh
                  img={carve}
                  imgright={right}
                  color="black"
                  text="Reciver’s info"
                // des="Vitae sed mi luctus laoreet."
                />
              </Grid>
              <Grid md={3} sx={{ display: { md: "flex", xs: "none" } }}>
                <Tabh
                  img={carve}
                  imgright={right}
                  color="black"
                  text="Payment Method"
                // des="Cursus semper viverra."
                />
              </Grid>
              <Grid md={3} sx={{ borderBottom: "3px solid  #4F46E5", display: { md: "flex", xs: "flex" } }}>
                <Tabh
                  img={carve}
                  imgright={three}
                  color="black"
                  text="Review & Confirm"
                // des="Penatibus eu quis ante."
                />
              </Grid>
              <Grid md={3} sx={{ display: { md: "flex", xs: "none" } }}>
                <Tabh
                  img={carve}
                  imgright={right2}
                  text="reCeipt"
                  color="#4F46E5"
                // des="Penatibus eu quis ante."
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* <TabHeader /> */}

        <Grid
          container
          sx={{
            display: "flex",
            backgroundColor: "#F7FDFF",
            justifyContent: "center",
          }}
        >
          <Grid
            item
            md={10.8}
            xs={12}
            sx={{
              transform: { lg: "scale(0.9)", xs: "scale(none)" },
              display: "flex",
              flexDirection: { md: "row", xs: "column" },
            }}
          >
            <Grid item md={4} xs={11} sx={{ pb: { lg: "0px", xs: "0px" }, marginTop: { lg: "56px", xs: "0px" }, padding: "20px" }}>
              <Typography className={classes.Review}>Review Detail</Typography>
              <Typography className={classes.Review_para}>
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                amet sint. Velit officia consequat duis enim velit mollit.
                Exercitation veniam consequat sunt nostrud amet.
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
              sx={{
                // marginBottom:{lg:"0px",xs:"-10"},
                height: "1,108px",
                margin: { lg: "56px 20px 196px 20px", xs: "20px 0px 0px 0px", },
                padding: "15px",
                backgroundColor: "#ffff",
              }}
            >
              <Typography sx={{ mt: { lg: "42px", xs: "30px" } }} className={classes.sender}>
                Sender
              </Typography>
              {/* <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  mt: "16px",
                  borderTop: "1px solid #9DAFBD",
                  paddingTop: "16px",
                  alignItems: "center",
                }}
              >
                <img src={flag} style={{ width: "40px", height: "40px" }} />
                <Box ml={3}>
                  <Typography className={classes.country_txt}>
                    Walton Lindsay{" "}
                  </Typography>
                  <Typography className={classes.country_para}>UK</Typography>
                </Box>
              </Box> */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    mt: "32px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <img src={flag} style={{ width: "40px", height: "40px" }} />

                  <Box ml={3}>
                    <Typography className={classes.country_txt}>
                      Georges Talk
                    </Typography>
                    <Typography className={classes.country_para}>UK</Typography>
                  </Box>
                </Box>


                <AppButton
                  title={"KYC"}
                  color={"#34A853"}
                  maxWidth="50px"
                  width="100%"
                  backgroundColor={"#4AD66F33"}
                  padding={"10px 32px 10px 36px"}
                  fontSize={"14px"}

                  textTransform="none"
                  fontWeight={"500"}
                  lineHeight={"20px"}
                  height="38px"
                  borderRadius="19px"
                  // endIcon={<ArrowForwardIcon />}
                  margin={"0px 0px 0px 10px"}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    mt: "32px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >


                  <img
                    src={meta}
                  // style={{ width: "35.56px", height: "26.67px" }}
                  />
                  <Box ml={3}>
                    <Typography color="#34A853" className={classes.country_txt}>
                      Metamask
                    </Typography>
                    <Typography className={classes.country_para}>{shortName}</Typography>
                  </Box>
                </Box>


                <AppButton
                  title={"Edit"}
                  color={"#111827"}
                  maxWidth="50px"
                  width="100%"
                  backgroundColor={"#F3F4F6"}
                  padding={"10px 32px 10px 36px"}
                  fontSize={"14px"}

                  textTransform="none"
                  fontWeight={"500"}
                  lineHeight={"20px"}
                  height="38px"
                  borderRadius="19px"
                  // endIcon={<ArrowForwardIcon />}
                  margin={"0px 0px 0px 10px"}
                />
              </Box>
              <Box mt="16px">

                <Divider />
              </Box>
              <Box mt="32px">
                <Typography className={classes.sender}>Receiver</Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      mt: "26px",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <img src={female} style={{ width: "40px", height: "40px" }} />
                    <Box ml={3}>
                      <Typography className={classes.country_txt}>
                        Lindsay Walton{" "}
                      </Typography>
                      <Typography className={classes.country_para}>FR</Typography>
                    </Box>
                  </Box>
                  <AppButton
                    title={"Edit"}
                    color={"#111827"}
                    textTransform="none"
                    maxWidth="50px"
                    width="100%"

                    backgroundColor={"#F3F4F6"}
                    padding={"10px 32px 10px 36px"}
                    fontSize={"14px"}
                    fontWeight={"500"}
                    lineHeight={"20px"}
                    height="38px"
                    borderRadius="19px"
                    // endIcon={<ArrowForwardIcon />}
                    margin={"0px 0px 0px 10px"}
                  />
                </Box>
                <Box mt="26px">
                  <Typography className={classes.sender_para}>
                    The beneficiary must present an official identity document. Make
                    sure the beneficiary's name matches the name on their ID
                    exactly.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: "32px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <img src={running} />
                    <Typography
                      sx={{
                        marginLeft: "10px",
                        fontFamily: "Inter !important",
                        fontSize: "14px !important",
                        fontWeight: "500 !important",
                        lineHeight: "20px !important",

                        color: "#34A853",
                      }}
                    >
                      Availability
                    </Typography>
                  </Box>
                  <AppButton
                    title={"Immediate"}
                    color={"#34A853"}
                    maxWidth="355px"

                    textTransform="none"
                    width="100%"
                    backgroundColor={"#EBF7EE"}
                    padding={"10px 32px 10px 36px"}
                    fontSize={"14px"}
                    fontWeight={"500"}
                    lineHeight={"20px"}
                    height="40px"
                    borderRadius="6px"
                    // endIcon={<ArrowForwardIcon />}
                    margin={"0px 0px 0px 10px"}
                  />
                </Box>
                <Box sx={{ padding: "10px 0px 0px 0px" }}>
                  <Typography
                    sx={{
                      fontFamily: "Inter !important",
                      fontSize: "14px !important",
                      fontWeight: "500 !important",
                      lineHeight: "20px !important",
                      mb: "4px"
                    }}
                  >
                    Receiving Country - Currency
                  </Typography>
                  <Box sx={{
                    border: "1px solid #D1D5DB",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    padding: "9px 13px !important",
                  }}>

                    <Box sx={{ mr: "20px" }}>

                      <img src={flag2} />
                    </Box>
                    <TextField
                      sx={{
                        // marginTop: "3px",
                        // width: { md: "710px", xs: "330px" },
                        backgroundColor: "white",
                        textAlign: "center",
                        // padding: "0px 13px !important",
                        // height: "42px",
                      }}
                      placeholder="France (EUR - €)"
                      // disableUnderline={true}
                      variant="standard"
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                      }}
                    />
                    <Box>

                      <img src={updown} />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ padding: "10px 0px 0px 0px" }}>
                  <Typography
                    sx={{
                      mb: "4px",
                      fontFamily: "Inter !important",
                      fontSize: "14px !important",
                      fontWeight: "500 !important",
                      lineHeight: "20px !important",
                    }}
                  >
                    Purpose of transaction
                  </Typography>
                  <Box sx={{
                    border: "1px solid #D1D5DB",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    padding: "9px 13px !important",
                  }}>


                    <TextField
                      sx={{
                        // marginTop: "3px",
                        // width: { md: "710px", xs: "330px" },
                        backgroundColor: "white",
                        textAlign: "center",
                        // padding: "0px 13px !important",
                        // height: "38px",
                      }}
                      placeholder="Saving"
                      // disableUnderline={true}
                      variant="standard"
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                      }}
                    />
                    <Box>

                      <img src={updown} />
                    </Box>
                  </Box>
                </Box>{" "}
                <Box sx={{ padding: "10px 0px 0px 0px" }}>
                  <Typography
                    sx={{
                      mb: "4px",
                      fontFamily: "Inter !important",
                      fontSize: "14px !important",
                      fontWeight: "500 !important",
                      lineHeight: "20px !important",
                    }}
                  >
                    Source of funds
                  </Typography>
                  <Box sx={{
                    border: "1px solid #D1D5DB",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    padding: "9px 13px !important",
                  }}>


                    <TextField
                      sx={{
                        // marginTop: "3px",
                        // width: { md: "710px", xs: "330px" },
                        backgroundColor: "white",
                        textAlign: "center",
                        // padding: "0px 13px !important",
                        // height: "38px",

                      }}
                      placeholder="Saving"
                      // disableUnderline={true}
                      variant="standard"
                      fullWidth
                      InputProps={{
                        disableUnderline: true,
                      }}
                    />
                    <Box>

                      <img src={updown} />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{

                  mt: "32px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <img src={Bicon} style={{ width: "40px", height: "40px" }} />

                  <Box ml={3}>
                    <Typography className={classes.country_txt}>
                       {TokenAmount} {tokenName}= ${usdPrice}
                    </Typography>
                    <Typography className={classes.country_parablack}>{network}</Typography>
                  </Box>
                </Box>


                <AppButton
                  title={"Edit Amount"}
                  color={"black"}
                  maxWidth="107px"
                  width="100%"
                  backgroundColor={"#F3F4F6"}
                  padding={"9px 0px 9px 0px"}
                  fontSize={"14px"}

                  textTransform="none"
                  fontWeight={"500"}
                  lineHeight={"20px"}
                  height="38px"
                  borderRadius="19px"
                  // endIcon={<ArrowForwardIcon />}
                  margin={"0px 0px 0px 10px"}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "0px 10px 0px 10px",
                  margin: "48px 0px 40px 0px",
                }}
              >
                <Box>
                  <Typography className={classes.transaction}>
                    You Sent
                  </Typography>
                  <Typography className={classes.transaction}>
                    Blockhain
                  </Typography>
                  <Typography className={classes.transaction}>
                    Transfer Rate
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>

                    <Typography sx={{ marginLeft: { lg: "21.5px", xs: "5px" } }} className={classes.transaction}>
                      Fee (<span style={{ color: "#34A853", }}>-{transFeePercent}%</span>)
                    </Typography>{" "}
                    <img src={x} style={{ marginTop: "-3px" }} />
                  </Box>
                  {/* <Typography className={classes.transaction}>Fee</Typography>{" "} */}
                  <Typography className={classes.transaction}>
                    Transfer Time
                  </Typography>
                  <Typography className={classes.transaction_Link}>
                    Recipient Gets
                  </Typography>
                  <Typography className={classes.transaction_Link}>
                    Total to pay
                  </Typography>
                </Box>
                <Box>
                  <Typography align="right" className={classes.Prices}>{TokenAmount} {tokenName} = {usdPrice} $</Typography>
                  <Typography align="right" className={classes.Prices}>
                    {network}
                  </Typography>{" "}
                  <Typography align="right" className={classes.Prices}>
                    0,000050 = $1
                  </Typography>{" "}
                  <Typography align="right" className={classes.Prices}>+{transFeeUsd}$ </Typography>{" "}
                  {/* <Typography align="right" className={classes.Prices}>+ $2.50</Typography>{" "} */}


                  <Typography align="right" className={classes.Prices}>1 Min</Typography>{" "}
                  <Typography align="right" className={classes.Prices}>100€</Typography>{" "}
                  <Typography align="right" className={classes.Prices}><span style={{ color: "#FF0000" }}> {TokenAmount} {tokenName} </span> = ${transFeeUsd+usdPrice}</Typography>
                </Box>
              </Box>
              <Box sx={{ marginTop: "21px", paddingRight: "10px", }}>
                <Box
                  sx={{

                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    flexDirection: "row",
                    // marginTop: "56px",
                  }}
                >
                  <Link to="/addnewtwo" style={{ textDecoration: "none", width: "142px" }}>
                    <Box sx={{ marginRight: { md: "10px", xs: "10px" }, }}>
                      <AppButton
                        title={"Cancel"}
                        color={"#FFFFFF"}
                        textTransform="none"
                        maxWidth={"142px"}
                        width={"142px"}
                        backgroundColor={"#6A6A6A"}
                        // padding={"9px 10px"}
                        fontSize={"14px"}
                        fontWeight={"500"}
                        lineHeight={"20px"}
                        border="1px solid #6A6A6A"
                        borderRadius="6px"
                        height="38px"
                        // endIcon={<ArrowForwardIcon />}
                        margin={"0px 0px 0px 10px"}
                      />
                    </Box>
                  </Link>
                  <a style={{ textDecoration: "none", width: "142px" }}>


                    <AppButton
                      textTransform="none"
                      title={"Confirm"}
                      color={"#FFFFFF"}
                      maxWidth="142px"
                      width="100%"
                      backgroundColor={"#34A853"}
                      // padding={"9px 15px"}
                      fontSize={"14px"}
                      fontWeight={"500"}
                      lineHeight={"20px"}
                      height="38px"
                      borderRadius="6px"
                      // endIcon={<ArrowForwardIcon />}
                      margin={"0px 0px 0px 10px"}
                      onClick={handleSendToken}
                    />
                  </a>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid>
        <Footer />
      </Grid> */}

      </Layout>

    </>
  );
};

export default ReviewandDetail;
//
