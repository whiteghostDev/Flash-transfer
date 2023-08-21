/** @format */

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import close from '../../assests/Images/close.png';
import '../../font.css/index.css';

import A1 from '../../assests/Images/W1.png';
import A2 from '../../assests/Images/W2.png';
import A3 from '../../assests/Images/W3.png';
import A4 from '../../assests/Images/W4.png';
import A5 from '../../assests/Images/W5.png';
import { useWallet } from '../../Context/wallet_context';
import { toast } from 'react-toastify';
import AppButton from '../AppButton';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { useAuth } from '../../Context/globaltContext';
import { useNavigate } from 'react-router-dom';
import { getNonce, signInWithWallet } from '../../Services/auth';
import { hexEncode, signMessage } from '../../utils';
export interface AppProps {
	menuicon?: any;
	name?: any;
	namesize?: any;
	priceimg1?: any;
	width?: any;
	margin?: any;
}
export default function ModalWallet({
	margin,
	width,
	menuicon,
	name,
	namesize,
	priceimg1,
}: AppProps) {
	const [open, setOpen] = React.useState(false);
	const [modalOpen, setModalOpen] = React.useState(true);
	const [trConnect, setTrConnect] = React.useState<boolean>(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const { account, connect, disconnect } = useWallet();
	const { library } = useActiveWeb3React();
	const { setTrFetchUser } = useAuth();
	const navigate = useNavigate();
	const connectMetamask = () => {
		if (account) {
		} else {
			connect('METAMASK');
		}
	};
	const connectBinance = () => {
		if (account) {
		} else {
			connect('BSC_CONNECT');
		}
	};
	const connectTrustWallet = () => {
		if (account) {
		} else {
			connect('TRUST_CONNECT');
		}
	};
	const WalletConnect = () => {
		if (account) {
		} else {
			connect('WALLET_CONNECT');
		}
	};
	const handleDisconnect = () => {
		disconnect();
	};

	const data = [
		{
			logo: A1,
			name: 'Flash Wallet',
			url: '',
			connecter: () => {},
		},
		// {
		//   logo: A2,
		//   name: "Binance Wallet",
		//   url: ""
		// },
		{
			logo: A3,
			name: 'Metamask',
			url: '',
			connecter: () => {
				connectMetamask();
			},
		},
		{
			logo: A4,
			name: 'Trust Wallet',
			url: '',
			connecter: () => {
				connectTrustWallet();
			},
		},
		{
			logo: A5,
			name: 'Wallet Connect',
			url: '',
			connecter: () => {
				WalletConnect();
			},
		},
	];
	const SignInWithWallet = React.useCallback(() => {
		if (!account) {
			setOpen(true);
			return;
		}
		if (!library) {
			toast.warn('web3 provider is not connected!');
			return;
		}
		if (account && library) {
			setTrConnect(false);
			getNonce({ pub_addr: account })
				.then((nonce: any) => {
					console.log('1222222222222');
					const msg = hexEncode(`I am signing my one-time nonce: ${nonce}`);

					return new Promise((resolve: any, reject: any) => {
						signMessage(library, account, '0x' + msg)
							.then((res: any) => {
								resolve(res);
								setTrConnect(false);
							})
							.catch((error) => {
								setTrConnect(false);
								reject(error);
							});
					});
				})
				.then((signature: any) => {
					setTrConnect(false);
					return signInWithWallet({ pub_addr: account, signature: signature });
				})
				.then((res: any) => {
					setTrConnect(false);
					setTrFetchUser(true);
					navigate('/');
				})
				.catch((error: any) => {
					if (error?.response?.data?.error) {
						toast.error(error?.response?.data?.error);
					}
					disconnect();
					setTrConnect(false);
				});
		}
	}, [account, library]);
	React.useEffect(() => {
		if (trConnect && account && library) {
			SignInWithWallet();
		}
	}, [trConnect, account, library]);
	return (
		<div>
			<Box margin={margin ? margin : '0px -200px 0px 0px'}>
				<AppButton
					fontSize={namesize ? namesize : '24px'}
					title={name}
					color={'#FFFFFF'}
					width={width}
					backgroundColor={'#5D5FEF'}
					borderRadius={'8px'}
					height='56px'
					padding='13px 19px'
					textTransform={'none'}
					boxShadow={'0px 1px 2px rgba(0, 0, 0, 0.05)'}
					fontWeight={'700px'}
					lineHeight={'32px'}
					onClick={handleOpen}
					startIcon={<img src={priceimg1} alt='image' />}
				/>
			</Box>
			{/* <IconButton >
        {menuicon}
      </IconButton> */}
			<Modal
				aria-labelledby='transition-modal-title'
				open={open}
				onClick={handleClose}
				BackdropComponent={Backdrop}
				// hideBackdrop={true}
				closeAfterTransition
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<Box
						sx={{
							cursor: 'pointer',
							position: 'absolute',
							height: { md: '378px', xs: '278px' },
							top: { md: '275px', xs: '190px' },
							left: { md: '63%', xl: '63%', xs: '60%' },
							transform: 'translate(-50%, -50%)',
							width: { md: '412px', xs: '267px' },
							bgcolor: 'background.paper',
							boxShadow: '0px 5px 30px rgba(0, 0, 0, 0.15) ',
							padding: '0px 30px',
							borderRadius: '14px',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'end',
							}}
						>
							<Button
								sx={{
									display: { md: 'flex', xs: 'none' },
								}}
								onClick={handleClose}
								endIcon={<img src={close} style={{ marginTop: '22px' }} />}
							/>
						</Box>

						<Box
							sx={{
								marginTop: { md: '10px', xs: '-1px' },
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<Typography
								sx={{
									display: { md: 'flex', xs: 'none' },

									textAlign: 'center',
									padding: '0px 0px 10px  0px',
									fontWeight: '800  !important',
									fontSize: '24px  !important',
									lineHeight: '32px  !important',
									fontFamily: 'Inter !important',
								}}
							>
								Wallet
							</Typography>
							{data.map((i) => {
								return (
									<Box
										onClick={() => {
											i.connecter();
											setTrConnect(true);
										}}
										sx={{
											borderTop: '0.5px solid #6A6A6A',
											display: 'flex',
											alignItems: 'center',
											flexDirection: 'row',
											padding: { md: '13px 10px', xs: '18px 10px' },
										}}
									>
										<img src={i.logo} />
										<Typography
											sx={{
												padding: '0px 15px',
												fontWeight: '400  !important',
												fontSize: '16px  !important',
												lineHeight: '24px  !important',
												fontFamily: 'Inter !important',
											}}
										>
											{i.name}
											{/* <Link
                        to={i.url}
                        style={{
                          textDecoration: "none",
                          color: `${i.color}`,
                          fontSize: "",
                        }}
                      >
                       
                      </Link> */}
										</Typography>
									</Box>
								);
							})}
						</Box>
					</Box>
				</Fade>
			</Modal>
		</div>
	);
}
