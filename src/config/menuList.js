
const menuList = [
    {
        title: "Home",
        icon: 'HomeOutlined',
        key: "/home"
    },

    {
        title: "User",
        icon: "AppstoreOutlined",
        key: "/user",
        children: [
            {
                title: 'Category',
                icon: 'UnorderedListOutlined',
                key: '/category',
            },
            {
                title: 'Products',
                icon: 'ToolOutlined',
                key: '/product',
            }
        ]
    },
    {
        title: 'User Manage',
        icon: 'HomeOutlined',
        key: '/User'
    },
    {
        title: 'Access Manage',
        icon: 'SafetyCertificateOutlined',
        key: '/role'
    },
    {
        title: 'Data Analysis',
        icon: 'UserOutlined',
        key: '/data',
        children: [
            {
                title: 'Bar Chart',
                icon: 'BarChartOutlined',
                key: '/bar',
            },
            {
                title: 'Pie Chart',
                icon: 'PieChartOutlined',
                key: '/pie',
            },
            {
                title: 'Line Chart',
                icon: 'LineChartOutlined',
                key: '/line',
            }
        ]
    }
]
export default menuList;