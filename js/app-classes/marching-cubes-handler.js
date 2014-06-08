define(
function()
{
	var MarchingCubesHandler = function()
	{
		var that = this;
		var num_points = 11;
		var x_min = -2;
		var x_max = 2;
		var y_min = -2;
		var y_max = 2;
		var z_min = -2;
		var z_max = 2;

		var cube_x = [];
		var cube_y = [];
		var cube_z = [];

		that.marchingCubes = function(evaluate_function)
		{

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
