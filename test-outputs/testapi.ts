import 'dotenv/config';

const apiKey = process.env.OCTAV_API_KEY

const main = async () => {
    const deployerAddress = '0x895614c89beC7D11454312f740854d08CbF57A78';

    const response = await fetch(
    `https://api.octav.fi/v1/wallet?addresses=${deployerAddress}`,
    {
        headers: {
        'Authorization': `Bearer ${apiKey}`
        }
    }
    );

    const everything = await response.json() as any[];
    const [wallet] = everything;
    console.log(`Total wallet value: $${wallet.networth}`);
    console.log(everything)
}

main()