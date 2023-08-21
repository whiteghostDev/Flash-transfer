/** @format */

import * as React from 'react';
import { useCallback } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { Box } from '@mui/material';
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
import logo5 from '../../assests/Logo/wallet.png';
import { toast } from 'react-toastify';
import {
	signInWithWallet,
	getNonce,
	signUpWithWallet,
	register,
} from '../../Services/auth';
import { hexEncode, signMessage } from '../../utils';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { useNavigate } from 'react-router-dom';

// import user from "../../assets/images/user.png";
// import trash from "../../assets/images/trash.png";
// import add from "../../assets/images/add.png";
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import AppButton from '../AppButton';
import { useAuth } from '../../Context/globaltContext';
export interface AppProps {
	menuicon?: any;
}
export default function WalletSignInModal({ menuicon }: AppProps) {
	const [open, setOpen] = React.useState(false);

	const [modalOpen, setModalOpen] = React.useState(true);
	const { account, connect, disconnect } = useWallet();
	const [isSignIn, setIsSignIn] = React.useState<boolean>(false);

	const { library } = useActiveWeb3React();
	const { setTrFetchUser } = useAuth();
	const navigate = useNavigate();

	const handleClose = () => setOpen(false);

	const connectMetamask = useCallback(() => {
		if (account) {
			toast.warning('you are connected now!');
		} else {
			connect('METAMASK');
		}
	}, [account]);

	const connectBinance = useCallback(() => {
		if (account) {
			toast.warning('you are connected now!');
		} else {
			connect('BSC_CONNECT');
		}
	}, [account]);

	const connectTrustWallet = useCallback(() => {
		if (account) {
			toast.warning('you are connected now!');
		} else {
			connect('TRUST_CONNECT');
		}
	}, [account]);

	const WalletConnect = useCallback(() => {
		if (account) {
			toast.warning('you are connected now!');
		} else {
			connect('WALLET_CONNECT');
		}
	}, [account]);

	const handleDisconnect = () => {
		disconnect();
	};
	const handleOpen = () => {
		setOpen(true);
	};
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
			setIsSignIn(false);
			getNonce({ pub_addr: account })
				.then((nonce: any) => {
					const msg = hexEncode(`I am signing my one-time nonce: ${nonce}`);

					return new Promise((resolve: any, reject: any) => {
						signMessage(library, account, '0x' + msg)
							.then((res: any) => {
								resolve(res);
								setIsSignIn(false);
							})
							.catch((error) => {
								setIsSignIn(false);
								reject(error);
							});
					});
				})
				.then((signature: any) => {
					setIsSignIn(false);
					return signInWithWallet({ pub_addr: account, signature: signature });
				})
				.then((res: any) => {
					setIsSignIn(false);
					setTrFetchUser(true);
					navigate('/');
				})
				.catch((error: any) => {
					if (error?.response?.data?.error) {
						toast.error(error?.response?.data?.error);
					}
					setIsSignIn(false);
				});
		}
	}, [account, library]);

	React.useEffect(() => {
		if (isSignIn && account && library) {
			SignInWithWallet();
		}
	}, [isSignIn, account, library]);

	const data = React.useMemo(() => {
		return [
			{
				logo: A1,
				name: 'Flash Wallet',
				url: '',
				connecter: () => {},
			},

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
	}, []);
	return (
		<div>
			<Box sx={{ display: { lg: 'flex', xs: 'none' } }}>
				<AppButton
					title={'Login with Wallet (Web 3)'}
					textTransform='none'
					backgroundColor={'white'}
					color={'#000000'}
					fontSize={'20px'}
					fontWeight={'500'}
					lineHeight={'30px'}
					borderRadius={'8px'}
					border={'1px solid #979797'}
					letterSpacing={'0.02em'}
					padding={'18px 0px 18px 70px'}
					startIcon={<img src={logo5} alt='image' />}
					onClick={handleOpen}
				/>
			</Box>

			<Box sx={{ display: { lg: 'none', xs: 'flex' } }}>
				<AppButton
					title={'Login with Wallet (Web 3)'}
					backgroundColor={'white'}
					color={'#000000'}
					fontSize={'16px'}
					fontWeight={'500'}
					lineHeight={'24px'}
					borderRadius={'8px'}
					height='42px'
					textTransform='none'
					border={'1px solid #979797'}
					letterSpacing={'0.02em'}
					padding={'18px 0px 18px 60px'}
					startIcon={
						<img
							src={logo5}
							alt='image'
							style={{ width: '20px', height: '20px' }}
						/>
					}
					onClick={handleOpen}
				/>
			</Box>
			<Modal
				aria-labelledby='transition-modal-title'
				open={open}
				onClick={handleClose}
				BackdropComponent={Backdrop}
				closeAfterTransition
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<Box
						sx={{
							position: 'absolute',
							height: { md: '378px', xs: '278px' },
							top: { md: '188px', xs: '190px' },
							left: { md: '68%', xs: '60%' },
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
								// paddingTop: {md:"0px",xs:"20px"},

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
							{data.map((i, key) => {
								return (
									<Box
										key={key}
										onClick={() => {
											i.connecter();
											setIsSignIn(true);
										}}
										sx={{
											borderTop: '0.5px solid #6A6A6A',
											display: 'flex',
											alignItems: 'center',
											flexDirection: 'row',
											// justifyContent: "center",
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
