define(
function()
{
	var MarchingCubesHandler = function()
	{
		var that = this;
		var num_points = 20;
		var x_min = -5;
		var x_max = 5;
		var y_min = -5;
		var y_max = 5;
		var z_min = -5;
		var z_max = 5;

		// Table obtained in the following link:
		// http://graphics.stanford.edu/~mdfisher/MarchingCubes.html
		var edge_table=[	0x0  , 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
							0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
							0x190, 0x99 , 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
							0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
							0x230, 0x339, 0x33 , 0x13a, 0x636, 0x73f, 0x435, 0x53c,
							0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
							0x3a0, 0x2a9, 0x1a3, 0xaa , 0x7a6, 0x6af, 0x5a5, 0x4ac,
							0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
							0x460, 0x569, 0x663, 0x76a, 0x66 , 0x16f, 0x265, 0x36c,
							0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
							0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff , 0x3f5, 0x2fc,
							0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
							0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55 , 0x15c,
							0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
							0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc ,
							0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
							0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
							0xcc , 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
							0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
							0x15c, 0x55 , 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
							0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
							0x2fc, 0x3f5, 0xff , 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
							0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
							0x36c, 0x265, 0x16f, 0x66 , 0x76a, 0x663, 0x569, 0x460,
							0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
							0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa , 0x1a3, 0x2a9, 0x3a0,
							0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
							0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33 , 0x339, 0x230,
							0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
							0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99 , 0x190,
							0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
							0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0 ];

		var edges_triangle_table = [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1],
		[3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1],
		[3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1],
		[3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1],
		[9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1],
		[1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1],
		[9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1],
		[2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1],
		[8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1],
		[9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1],
		[4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1],
		[3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1],
		[1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1],
		[4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1],
		[4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1],
		[9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1],
		[1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1],
		[5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1],
		[2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1],
		[9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1],
		[0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1],
		[2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1],
		[10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1],
		[4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1],
		[5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1],
		[5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1],
		[9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1],
		[0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1],
		[1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1],
		[10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1],
		[8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1],
		[2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1],
		[7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1],
		[9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1],
		[2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1],
		[11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1],
		[9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1],
		[5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1],
		[11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1],
		[11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1],
		[1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1],
		[9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1],
		[5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1],
		[2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1],
		[0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1],
		[5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1],
		[6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1],
		[0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1],
		[3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1],
		[6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1],
		[5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1],
		[1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1],
		[10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1],
		[6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1],
		[1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1],
		[8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1],
		[7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1],
		[3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1],
		[5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1],
		[0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1],
		[9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1],
		[8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1],
		[5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1],
		[0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1],
		[6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1],
		[10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1],
		[10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1],
		[8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1],
		[1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1],
		[3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1],
		[0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1],
		[10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1],
		[0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1],
		[3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1],
		[6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1],
		[9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1],
		[8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1],
		[3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1],
		[6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1],
		[0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1],
		[10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1],
		[10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1],
		[1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1],
		[2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1],
		[7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1],
		[7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1],
		[2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1],
		[1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1],
		[11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1],
		[8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1],
		[0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1],
		[7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1],
		[10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1],
		[2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1],
		[6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1],
		[7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1],
		[2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1],
		[1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1],
		[10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1],
		[10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1],
		[0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1],
		[7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1],
		[6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1],
		[8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1],
		[9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1],
		[6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1],
		[1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1],
		[4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1],
		[10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1],
		[8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1],
		[0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1],
		[1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1],
		[8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1],
		[10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1],
		[4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1],
		[10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1],
		[5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1],
		[11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1],
		[9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1],
		[6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1],
		[7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1],
		[3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1],
		[7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1],
		[9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1],
		[3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1],
		[6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1],
		[9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1],
		[1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1],
		[4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1],
		[7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1],
		[6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1],
		[3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1],
		[0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1],
		[6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1],
		[1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1],
		[0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1],
		[11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1],
		[6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1],
		[5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1],
		[9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1],
		[1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1],
		[1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1],
		[10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1],
		[0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1],
		[5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1],
		[10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1],
		[11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1],
		[0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1],
		[9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1],
		[7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1],
		[2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1],
		[8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1],
		[9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1],
		[9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1],
		[1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1],
		[9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1],
		[9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1],
		[5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1],
		[0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1],
		[10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1],
		[2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1],
		[0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1],
		[0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1],
		[9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1],
		[5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1],
		[3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1],
		[5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1],
		[8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1],
		[0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1],
		[9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1],
		[0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1],
		[1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1],
		[3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1],
		[4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1],
		[9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1],
		[11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1],
		[11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1],
		[2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1],
		[9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1],
		[3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1],
		[1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1],
		[4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1],
		[4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1],
		[0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1],
		[3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1],
		[3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1],
		[0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1],
		[9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1],
		[1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]];
/*
		int Polygonise(GRIDCELL &Grid, TriMeshFace *Triangles, int &NewVertexCount, Vec3f *Vertices)
		{
		    int TriangleCount;
		    int CubeIndex;

		    Vec3f VertexList[12];
		    Vec3f NewVertexList[12];
		    char LocalRemap[12];
		    
		    //Determine the index into the edge table which
		    //tells us which vertices are inside of the surface
		    CubeIndex = 0;
		    if (Grid.val[0] < 0.0f) CubeIndex |= 1;
		    if (Grid.val[1] < 0.0f) CubeIndex |= 2;
		    if (Grid.val[2] < 0.0f) CubeIndex |= 4;
		    if (Grid.val[3] < 0.0f) CubeIndex |= 8;
		    if (Grid.val[4] < 0.0f) CubeIndex |= 16;
		    if (Grid.val[5] < 0.0f) CubeIndex |= 32;
		    if (Grid.val[6] < 0.0f) CubeIndex |= 64;
		    if (Grid.val[7] < 0.0f) CubeIndex |= 128;

		    //Cube is entirely in/out of the surface
		    if (edgeTable[CubeIndex] == 0)
		        return(0);

		    //Find the vertices where the surface intersects the cube
		    if (edgeTable[CubeIndex] & 1)
		        VertexList[0] =
		            vertex_interpolation(Grid.p[0],Grid.p[1],Grid.val[0],Grid.val[1]);
		    if (edgeTable[CubeIndex] & 2)
		        VertexList[1] =
		            vertex_interpolation(Grid.p[1],Grid.p[2],Grid.val[1],Grid.val[2]);
		    if (edgeTable[CubeIndex] & 4)
		        VertexList[2] =
		            vertex_interpolation(Grid.p[2],Grid.p[3],Grid.val[2],Grid.val[3]);
		    if (edgeTable[CubeIndex] & 8)
		        VertexList[3] =
		            vertex_interpolation(Grid.p[3],Grid.p[0],Grid.val[3],Grid.val[0]);
		    if (edgeTable[CubeIndex] & 16)
		        VertexList[4] =
		            vertex_interpolation(Grid.p[4],Grid.p[5],Grid.val[4],Grid.val[5]);
		    if (edgeTable[CubeIndex] & 32)
		        VertexList[5] =
		            vertex_interpolation(Grid.p[5],Grid.p[6],Grid.val[5],Grid.val[6]);
		    if (edgeTable[CubeIndex] & 64)
		        VertexList[6] =
		            vertex_interpolation(Grid.p[6],Grid.p[7],Grid.val[6],Grid.val[7]);
		    if (edgeTable[CubeIndex] & 128)
		        VertexList[7] =
		            vertex_interpolation(Grid.p[7],Grid.p[4],Grid.val[7],Grid.val[4]);
		    if (edgeTable[CubeIndex] & 256)
		        VertexList[8] =
		            vertex_interpolation(Grid.p[0],Grid.p[4],Grid.val[0],Grid.val[4]);
		    if (edgeTable[CubeIndex] & 512)
		        VertexList[9] =
		            vertex_interpolation(Grid.p[1],Grid.p[5],Grid.val[1],Grid.val[5]);
		    if (edgeTable[CubeIndex] & 1024)
		        VertexList[10] =
		            vertex_interpolation(Grid.p[2],Grid.p[6],Grid.val[2],Grid.val[6]);
		    if (edgeTable[CubeIndex] & 2048)
		        VertexList[11] =
		            vertex_interpolation(Grid.p[3],Grid.p[7],Grid.val[3],Grid.val[7]);

		    NewVertexCount=0;
		    for (UINT i=0;i<12;i++)
		        LocalRemap[i] = -1;

		    for (UINT i=0;edges_triangle_table[CubeIndex][i]!=-1;i++)
		    {
		        if(LocalRemap[edges_triangle_table[CubeIndex][i]] == -1)
		        {
		            NewVertexList[NewVertexCount] = VertexList[edges_triangle_table[CubeIndex][i]];
		            LocalRemap[edges_triangle_table[CubeIndex][i]] = NewVertexCount;
		            NewVertexCount++;
		        }
		    }

		    for (int i=0;i<NewVertexCount;i++) {
		        Vertices[i] = NewVertexList[i];
		    }

		    TriangleCount = 0;
		    for (UINT i=0;edges_triangle_table[CubeIndex][i]!=-1;i+=3) {
		        Triangles[TriangleCount].I[0] = LocalRemap[edges_triangle_table[CubeIndex][i+0]];
		        Triangles[TriangleCount].I[1] = LocalRemap[edges_triangle_table[CubeIndex][i+1]];
		        Triangles[TriangleCount].I[2] = LocalRemap[edges_triangle_table[CubeIndex][i+2]];
		        TriangleCount++;
		    }

		    return(TriangleCount);
		}
*/

		function vertex_interpolation(p1,p2,value1,value2)
		{
			var t;
			var point=[];
			if(value1==value2)
			{
				//alert("entrou aqui");
				t=0.5;
			}
			else
			{
				t = -value1 / (value2 - value1);
			}
			for(var i=0;i<3;i++)
			{
		    	point.push(p1[i] + t * (p2[i] - p1[i]));
		    }
		    return point;
		}

		function generateCube(evaluate_function,cube_vertices)
		{
			var points = [];

			var evaluation = [];

			var cube_case = 0;
			var evaluation_value;

			var edges = [	[0,	1],
							[1,	2],
							[2,	3],
							[3,	0],
							[4,	5],
							[5,	6],
							[6,	7],
							[7,	4],
							[0,	4],
							[1,	5],
							[2,	6],
							[3,	7]];

			for(var i=0;i<8;i++)
			{
				evaluation_value = evaluate_function(	cube_vertices[i][0],
														cube_vertices[i][1],
														cube_vertices[i][2]);
				evaluation.push(evaluation_value);
				if(evaluation_value<0)
				{
					cube_case+=Math.pow(2,i);
				}
			}

			var edges_to_draw = [];
			edges_to_draw = edges_triangle_table[cube_case];
			var vertices_to_draw = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

			for(var i=0;i<16;i++)
			{
				if(edges_to_draw[i]==-1)
				{
					vertices_to_draw[i] = [];
				}
				else
				{
					var first_vertex_index = edges[edges_to_draw[i]][0];
					var second_vertex_index = edges[edges_to_draw[i]][1];
					vertices_to_draw[i] = vertex_interpolation(cube_vertices[first_vertex_index],
																cube_vertices[second_vertex_index],
																evaluation[first_vertex_index],
																evaluation[second_vertex_index]);
				}
				//if(vertices_to_draw[i].length) alert(vertices_to_draw[i]);
			}
			for(var i=0;i<8;i++)
			{
				if(!vertices_to_draw[i*3].length) break;
				for(var j=0;j<3;j++)
				{
					points.push(vertices_to_draw[i*3][j]);
				}
				for(var j=0;j<3;j++)
				{
					points.push(vertices_to_draw[i*3+1][j]);
				}
				for(var j=0;j<3;j++)
				{
					points.push(vertices_to_draw[i*3+1][j]);
				}
				for(var j=0;j<3;j++)
				{
					points.push(vertices_to_draw[i*3+2][j]);
				}
				for(var j=0;j<3;j++)
				{
					points.push(vertices_to_draw[i*3+2][j]);
				}
				for(var j=0;j<3;j++)
				{
					points.push(vertices_to_draw[i*3][j]);
				}
			}
			/*
			if(!(cube_case&0x80==0))
			{
				cube_case = ~ cube_case;
			}
			*/


			return points;
		}

		that.marchingCubes = function(evaluate_function)
		{
			var points = [];

			var dx = (x_max - x_min)/num_points;
			var dy = (y_max - y_min)/num_points;
			var dz = (z_max - z_min)/num_points;

			var xb,yb,zb;
			var vertices_returned_from_cube = [];
			var cube_vertices;
			for(var ix=0;ix<num_points;ix++)
			{
				for(var iy=0;iy<num_points;iy++)
				{
					for(var iz=0;iz<num_points;iz++)
					{
						xb = x_min + ix*dx;
						yb = y_min + iy*dy;
						zb = z_min + iz*dz;

						cube_vertices = [	[xb,		yb,		zb],
											[xb+dx,		yb,		zb],
											[xb+dx,		yb+dy,	zb],
											[xb,		yb+dy,	zb],
											[xb,		yb,		zb+dz],
											[xb+dx,		yb,		zb+dz],
											[xb+dx,		yb+dy,	zb+dz],
											[xb,		yb+dy,	zb+dz]];

						vertices_returned_from_cube = generateCube(evaluate_function,cube_vertices);
						points = points.concat(vertices_returned_from_cube);
					}	
				}
			}

			return points;
		}

		function generateTetrahedron(evaluate_function,vertices_of_tetrahedron)
		{
			var points = [];

			var tet = [];
			/*
			for(var i=0;i<4;i++)
			{
				for(var j=0;j<4;j++)
				{
					
					tet.push(vertices_of_tetrahedron[i*3],
								vertices_of_tetrahedron[i*3+1],
								vertices_of_tetrahedron[i*3+2]);
					tet.push(vertices_of_tetrahedron[j*3],
								vertices_of_tetrahedron[j*3+1],
								vertices_of_tetrahedron[j*3+2]);
				}
			}
			*/
			var evaluation = [];
			var edges = [ 	0, 1,
							1, 2,
							2, 0,
							0, 3,
							3, 2,
							1, 3 ];

			var insertedPoints = 0;

			for(var i=0;i<4;i++)
			{
				evaluation.push(evaluate_function(	vertices_of_tetrahedron[i*3],
													vertices_of_tetrahedron[i*3+1],
													vertices_of_tetrahedron[i*3+2]));
			}

			var t;
			for(var i=0;i<6;i++)
			{
				if(evaluation[edges[i*2]]*evaluation[edges[i*2+1]]<0)
				{
					t = -evaluation[edges[i*2]]/(evaluation[edges[i*2+1]]-evaluation[edges[i*2]]);

					for(var j=0;j<3;j++)
					{
						points.push(vertices_of_tetrahedron[edges[i*2]*3+j] + t * (vertices_of_tetrahedron[edges[i*2+1]*3+j]-vertices_of_tetrahedron[edges[i*2]*3+j]));
					}
					insertedPoints++;
				}
			}

			if(insertedPoints==3)
			{
				points.push(points[0]);
				points.push(points[1]);
				points.push(points[2]);

				points.push(points[3]);
				points.push(points[4]);
				points.push(points[5]);

				points.push(points[6]);
				points.push(points[7]);
				points.push(points[8]);
			}

			if(insertedPoints==4)
			{
				points.push(points[9]);
				points.push(points[10]);
				points.push(points[11]);

				points.push(points[0]);
				points.push(points[1]);
				points.push(points[2]);

				points.push(points[6]);
				points.push(points[7]);
				points.push(points[8]);

				points.push(points[3]);
				points.push(points[4]);
				points.push(points[5]);
			}

			if(insertedPoints!=3 && insertedPoints!=4 && insertedPoints!=0)
			{
				points = [];
			}

			return points.concat(tet);
		}

		function tetrahedronVertices(cube_vertices,vertices_index)
		{
			var points = [];
			for(var i=0;i<vertices_index.length;i++)
			{
				for(var j=0;j<3;j++)
				{
					points.push(cube_vertices[vertices_index[i]*3+j]);
				}
			}
			return points;
		}

		that.marchingTetrahedron = function(evaluate_function)
		{
			var points = [];

			var dx = (x_max - x_min)/num_points;
			var dy = (y_max - y_min)/num_points;
			var dz = (z_max - z_min)/num_points;

			var xb,yb,zb;
			var vertices_returned_from_tetrahedron = [];
			var vertices_of_tetrahedron = [];
			var cube_vertices;
			var thetrahedron_vertices_index;
			for(var ix=0;ix<num_points;ix++)
			{
				for(var iy=0;iy<num_points;iy++)
				{
					for(var iz=0;iz<num_points;iz++)
					{
						xb = x_min + ix*dx;
						yb = y_min + iy*dy;
						zb = z_min + iz*dz;

						cube_vertices = [	xb,		yb,		zb,
											xb+dx,	yb,		zb,
											xb+dx,	yb+dy,	zb,
											xb,		yb+dy,	zb,
											xb,		yb,		zb+dz,
											xb+dx,	yb,		zb+dz,
											xb+dx,	yb+dy,	zb+dz,
											xb,		yb+dy,	zb+dz	];

						thetrahedron_vertices_index = [	0, 1, 5, 6,
														0, 4, 5, 6,
														0, 1, 2, 6,
														0, 3, 2, 6,
														0, 4, 7, 6,
														0, 3, 7, 6  ];

						for(var i=0;i<6;i++)
						{
							vertices_of_tetrahedron = tetrahedronVertices(cube_vertices,[	thetrahedron_vertices_index[i*4],
																							thetrahedron_vertices_index[i*4+1],
																							thetrahedron_vertices_index[i*4+2],
																							thetrahedron_vertices_index[i*4+3]]);
							vertices_returned_from_tetrahedron = generateTetrahedron(evaluate_function,vertices_of_tetrahedron);
							points = points.concat(vertices_returned_from_tetrahedron);
						}
					}	
				}
			}

			return points;
		}
	}
	return MarchingCubesHandler;	
});
